import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Appointment, AppointmentStatus, MessageKind, Prisma, RecurringSchedule } from '@prisma/client';
import { addDays, addWeeks, subHours } from 'date-fns';

import {
  APPOINTMENT_GENERATION_WEEKS_AHEAD,
  RESCHEDULE_SUGGESTION_LIMIT,
} from '../common/constants';
import { MessageKindValue } from '../common/enums';
import {
  clockLabel,
  formatInAppTimezone,
  shortDateTimeLabel,
} from '../common/utils/time.utils';
import { DisponibilidadeService } from '../disponibilidade/disponibilidade.service';
import { MensageriaService } from '../mensageria/mensageria.service';
import { PrismaService } from '../prisma/prisma.service';

type AppointmentWithPatient = Prisma.AppointmentGetPayload<{
  include: {
    patient: true;
    recurringSchedule: true;
    messageInteractions: {
      orderBy: { createdAt: 'desc' };
    };
  };
}>;

@Injectable()
export class AgendamentosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly disponibilidadeService: DisponibilidadeService,
    private readonly mensageriaService: MensageriaService,
  ) {}

  async listar() {
    return this.listarResumo({ limit: 50 });
  }

  async listarResumo(input?: {
    status?: AppointmentStatus;
    patientId?: string;
    limit?: number;
  }) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        status: input?.status,
        patientId: input?.patientId,
      },
      include: {
        patient: true,
      },
      orderBy: {
        startsAt: 'asc',
      },
      take: input?.limit ?? 20,
    });

    return {
      total: appointments.length,
      filtros: {
        status: input?.status ? this.traduzirStatusChave(input.status) : null,
        statusOriginal: input?.status ?? null,
        patientId: input?.patientId ?? null,
        limit: input?.limit ?? 20,
      },
      itens: appointments.map((appointment) => ({
        id: appointment.id,
        paciente: appointment.patient.fullName,
        telefone: appointment.patient.phoneNumber,
        dataHora: shortDateTimeLabel(appointment.startsAt),
        status: this.traduzirStatusChave(appointment.status),
        statusDescricao: this.traduzirStatus(appointment.status),
        origem: this.traduzirOrigemChave(appointment.source),
        origemDescricao: this.traduzirOrigemDescricao(appointment.source),
      })),
    };
  }

  async buscarPorId(id: string) {
    const agendamento = await this.buscarAgendamento(id);

    return this.formatarAgendamentoDetalhado(agendamento);
  }

  async gerarAgendamentosFuturos() {
    const schedules = await this.prisma.recurringSchedule.findMany({
      where: { active: true },
      include: { patient: true },
    });
    const createdAppointments: Appointment[] = [];

    for (const schedule of schedules) {
      const generated = await this.gerarAgendamentosPorRecorrencia(schedule);
      createdAppointments.push(...generated);
    }

    return {
      quantidadeCriada: createdAppointments.length,
      agendamentos: createdAppointments.map((agendamento) =>
        this.formatarAgendamentoBasico(agendamento),
      ),
    };
  }

  async enviarConfirmacoesPendentes(referenceDate = new Date()) {
    const windowStart = subHours(referenceDate, 1);
    const windowEnd = addDays(referenceDate, 1);
    windowEnd.setHours(referenceDate.getHours() + 1, referenceDate.getMinutes(), 0, 0);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        startsAt: {
          gt: windowStart,
          lte: windowEnd,
        },
        status: AppointmentStatus.SCHEDULED,
      },
      include: {
        patient: true,
      },
    });

    const results = [];
    for (const appointment of appointments) {
      const confirmationMessage =
        `Voce tem terapia agendada para ${formatInAppTimezone(appointment.startsAt)}.` +
        ' Responda 1 para confirmar, 2 para cancelar ou 3 para remarcar.';

      const interaction = await this.mensageriaService.enviarERastrearMensagem({
        idAgendamento: appointment.id,
        telefone: appointment.patient.phoneNumber,
        conteudo: confirmationMessage,
        tipo: MessageKindValue.CONFIRMATION,
      });

      const updatedAppointment = await this.prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.CONFIRMATION_PENDING,
          confirmationSentAt: new Date(),
        },
      });

      results.push({
        agendamento: this.formatarAgendamentoBasico(updatedAppointment),
        interacao: {
          id: interaction.id,
          tipo: this.traduzirTipoMensagem(interaction.kind),
          status: this.traduzirStatusInteracao(interaction.status),
        },
      });
    }

    return {
      quantidadeEnviada: results.length,
      resultados: results,
    };
  }

  async processarResposta(idAgendamento: string, resposta: '1' | '2' | '3') {
    const appointment = await this.buscarAgendamento(idAgendamento);

    const inboundInteraction = await this.mensageriaService.registrarInteracaoRecebida({
      idAgendamento,
      tipo: MessageKindValue.CONFIRMATION,
      conteudo: `Paciente respondeu ${resposta}`,
      codigoResposta: resposta,
    });

    if (resposta === '1') {
      const alreadyHandled =
        appointment.status === AppointmentStatus.CONFIRMED ||
        appointment.status === AppointmentStatus.RESCHEDULED;

      const updated = alreadyHandled
        ? appointment
        : await this.prisma.appointment.update({
            where: { id: idAgendamento },
            data: {
              status: AppointmentStatus.CONFIRMED,
              confirmedAt: new Date(),
            },
          });

      await this.mensageriaService.marcarComoProcessada(inboundInteraction.id);

      return {
        acao: 'confirmado',
        mensagem: 'Sessao confirmada com sucesso.',
        agendamento: this.formatarAgendamentoBasico(updated),
      };
    }

    if (resposta === '2') {
      const alreadyHandled = appointment.status === AppointmentStatus.CANCELLED;
      const updated = alreadyHandled
        ? appointment
        : await this.prisma.appointment.update({
            where: { id: idAgendamento },
            data: {
              status: AppointmentStatus.CANCELLED,
              cancellationReason: 'Cancelado pela paciente no fluxo de confirmacao',
            },
          });

      await this.mensageriaService.marcarComoProcessada(inboundInteraction.id);

      return {
        acao: 'cancelado',
        mensagem: 'Sessao cancelada com sucesso.',
        agendamento: this.formatarAgendamentoBasico(updated),
      };
    }

    const targetAppointment =
      appointment.status === AppointmentStatus.RESCHEDULE_REQUESTED
        ? appointment
        : await this.prisma.appointment.update({
            where: { id: idAgendamento },
            data: {
              status: AppointmentStatus.RESCHEDULE_REQUESTED,
            },
          });

    const schedule = appointment.recurringSchedule;
    if (!schedule) {
      throw new BadRequestException('Este agendamento nao possui recorrencia semanal.');
    }

    const options = await this.disponibilidadeService.buscarHorariosDisponiveis({
      inicioBusca: appointment.startsAt,
      duracaoMinutos: schedule.durationMinutes,
      limite: RESCHEDULE_SUGGESTION_LIMIT,
      ignorarAgendamentoId: appointment.id,
    });

    const message = options.length
      ? `Temos estas opcoes: ${options
          .map((option, index) => `${index + 1}. ${clockLabel(option.inicio)}`)
          .join(' | ')}`
      : 'Nao encontramos novos horarios disponiveis nos proximos 30 dias.';

    const outboundInteraction = await this.mensageriaService.enviarERastrearMensagem({
      idAgendamento: idAgendamento,
      telefone: appointment.patient.phoneNumber,
      conteudo: message,
      tipo: MessageKindValue.RESCHEDULE_OPTIONS,
      metadados: {
        options: options.map((option) => ({
          startAt: option.inicio.toISOString(),
          endAt: option.fim.toISOString(),
        })),
      },
    });

    await this.mensageriaService.marcarComoProcessada(inboundInteraction.id);

    return {
      acao: 'remarcacao_solicitada',
      mensagem: options.length
        ? 'Pedido de remarcacao recebido. Estas sao as opcoes encontradas.'
        : 'Pedido de remarcacao recebido, mas nao ha horarios livres no momento.',
      agendamento: this.formatarAgendamentoBasico(targetAppointment),
      opcoes: options.map((option) => ({
        inicio: option.inicio,
        fim: option.fim,
        descricao: `${clockLabel(option.inicio)} ate ${clockLabel(option.fim)}`,
      })),
      idInteracao: outboundInteraction.id,
    };
  }

  async selecionarHorarioRemarcacao(idAgendamento: string, inicio: Date) {
    const appointment = await this.buscarAgendamento(idAgendamento);
    if (!appointment.recurringSchedule) {
      throw new BadRequestException('Este agendamento nao possui recorrencia semanal.');
    }

    const latestOptionsInteraction = appointment.messageInteractions.find(
      (interaction) => interaction.kind === MessageKind.RESCHEDULE_OPTIONS,
    );

    if (!latestOptionsInteraction?.metadata || typeof latestOptionsInteraction.metadata !== 'object') {
      throw new BadRequestException('Nenhuma opcao de remarcacao foi gerada para este agendamento.');
    }

    const metadata = latestOptionsInteraction.metadata as Prisma.JsonObject;
    const rawOptions = Array.isArray(metadata.options) ? metadata.options : [];
    const selectedOption = rawOptions.find((entry) => {
      if (!entry || typeof entry !== 'object' || !('startAt' in entry)) {
        return false;
      }

      return new Date(String(entry.startAt)).getTime() === inicio.getTime();
    });

    if (!selectedOption || typeof selectedOption !== 'object' || !('endAt' in selectedOption)) {
      throw new BadRequestException('O horario escolhido nao esta entre as opcoes oferecidas.');
    }

    const start = new Date(String(selectedOption.startAt));
    const end = new Date(String(selectedOption.endAt));

    const conflicts = await this.prisma.appointment.findFirst({
      where: {
        id: { not: appointment.id },
        startsAt: { lt: end },
        endsAt: { gt: start },
        status: {
          in: ['SCHEDULED', 'CONFIRMATION_PENDING', 'CONFIRMED', 'RESCHEDULE_REQUESTED'],
        },
      },
    });

    if (conflicts) {
      throw new BadRequestException('O horario escolhido nao esta mais disponivel.');
    }

    const existingRescheduledChild = await this.prisma.appointment.findFirst({
      where: {
        originalAppointmentId: appointment.id,
        startsAt: start,
        endsAt: end,
      },
    });

    return this.prisma.$transaction(async (tx) => {
      await tx.messageInteraction.create({
        data: {
          appointmentId: idAgendamento,
          kind: MessageKind.RESCHEDULE_OPTIONS,
          direction: 'INBOUND',
          status: 'RECEIVED',
          provider: 'mock',
          channel: 'whatsapp',
          content: `Paciente escolheu ${start.toISOString()}`,
          responseCode: start.toISOString(),
        },
      });

      const original = await tx.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.RESCHEDULED,
          cancellationReason: 'Remarcado pela paciente',
        },
      });

      const newAppointment =
        existingRescheduledChild ??
        (await tx.appointment.create({
          data: {
            patientId: appointment.patientId,
            recurringScheduleId: appointment.recurringScheduleId,
            originalAppointmentId: appointment.id,
            startsAt: start,
            endsAt: end,
            status: AppointmentStatus.SCHEDULED,
            source: 'RESCHEDULE',
          },
        }));

      return {
        agendamentoOriginal: this.formatarAgendamentoBasico(original),
        novoAgendamento: this.formatarAgendamentoBasico(newAppointment),
        mensagem: 'Remarcacao concluida com sucesso.',
      };
    });
  }

  private async gerarAgendamentosPorRecorrencia(
    schedule: RecurringSchedule & { patient: { id: string } },
  ) {
    const created: Appointment[] = [];
    const startReference = new Date();
    const generationEnd = addWeeks(startReference, APPOINTMENT_GENERATION_WEEKS_AHEAD);

    let cursor = new Date(startReference);
    while (cursor <= generationEnd) {
      if (cursor.getDay() === schedule.weekday) {
        const candidateStart = new Date(cursor);
        const [hour, minute] = schedule.startTime.split(':').map(Number);
        candidateStart.setHours(hour, minute, 0, 0);
        const candidateEnd = new Date(candidateStart);
        candidateEnd.setMinutes(candidateEnd.getMinutes() + schedule.durationMinutes);

        if (candidateStart >= startReference) {
          const existing = await this.prisma.appointment.findFirst({
            where: {
              patientId: schedule.patientId,
              startsAt: candidateStart,
            },
          });

          if (!existing) {
            const createdAppointment = await this.prisma.appointment.create({
              data: {
                patientId: schedule.patientId,
                recurringScheduleId: schedule.id,
                startsAt: candidateStart,
                endsAt: candidateEnd,
                status: AppointmentStatus.SCHEDULED,
                source: 'RECURRING',
              },
            });
            created.push(createdAppointment);
          }
        }
      }

      cursor = addDays(cursor, 1);
    }

    return created;
  }

  private async buscarAgendamento(id: string): Promise<AppointmentWithPatient> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        recurringSchedule: true,
        messageInteractions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento ${id} nao encontrado.`);
    }

    return appointment;
  }

  private traduzirStatus(status: AppointmentStatus) {
    const map: Record<AppointmentStatus, string> = {
      SCHEDULED: 'Agendado',
      CONFIRMATION_PENDING: 'Aguardando confirmacao',
      CONFIRMED: 'Confirmado',
      CANCELLED: 'Cancelado',
      RESCHEDULE_REQUESTED: 'Remarcacao solicitada',
      RESCHEDULED: 'Remarcado',
    };

    return map[status];
  }

  private formatarAgendamentoBasico(agendamento: {
    id: string;
    startsAt: Date;
    endsAt: Date;
    status: AppointmentStatus;
    source?: string;
  }) {
    return {
      id: agendamento.id,
      inicio: agendamento.startsAt,
      fim: agendamento.endsAt,
      status: this.traduzirStatusChave(agendamento.status),
      statusDescricao: this.traduzirStatus(agendamento.status),
      origem: agendamento.source ? this.traduzirOrigemChave(agendamento.source) : null,
      origemDescricao: agendamento.source ? this.traduzirOrigemDescricao(agendamento.source) : null,
    };
  }

  private formatarAgendamentoDetalhado(agendamento: AppointmentWithPatient) {
    return {
      id: agendamento.id,
      inicio: agendamento.startsAt,
      fim: agendamento.endsAt,
      status: this.traduzirStatusChave(agendamento.status),
      statusDescricao: this.traduzirStatus(agendamento.status),
      origem: this.traduzirOrigemChave(agendamento.source),
      origemDescricao: this.traduzirOrigemDescricao(agendamento.source),
      confirmacaoEnviadaEm: agendamento.confirmationSentAt,
      confirmadaEm: agendamento.confirmedAt,
      motivoCancelamento: agendamento.cancellationReason,
      paciente: {
        id: agendamento.patient.id,
        nomeCompleto: agendamento.patient.fullName,
        telefone: agendamento.patient.phoneNumber,
        email: agendamento.patient.email,
        observacoes: agendamento.patient.notes,
      },
      horarioRecorrente: agendamento.recurringSchedule
        ? {
            id: agendamento.recurringSchedule.id,
            diaSemana: agendamento.recurringSchedule.weekday,
            horarioInicio: agendamento.recurringSchedule.startTime,
            duracaoMinutos: agendamento.recurringSchedule.durationMinutes,
            ativo: agendamento.recurringSchedule.active,
          }
        : null,
      interacoesMensagem: agendamento.messageInteractions.map((interacao) => ({
        id: interacao.id,
        tipo: this.traduzirTipoMensagem(interacao.kind),
        direcao: this.traduzirDirecaoMensagem(interacao.direction),
        status: this.traduzirStatusInteracao(interacao.status),
        conteudo: interacao.content,
        codigoResposta: interacao.responseCode,
        criadoEm: interacao.createdAt,
      })),
    };
  }

  private traduzirStatusChave(status: AppointmentStatus) {
    const map: Record<AppointmentStatus, string> = {
      SCHEDULED: 'agendado',
      CONFIRMATION_PENDING: 'aguardando_confirmacao',
      CONFIRMED: 'confirmado',
      CANCELLED: 'cancelado',
      RESCHEDULE_REQUESTED: 'remarcacao_solicitada',
      RESCHEDULED: 'remarcado',
    };

    return map[status];
  }

  private traduzirOrigemChave(origem: string) {
    return origem === 'RECURRING' ? 'recorrencia' : 'remarcacao';
  }

  private traduzirOrigemDescricao(origem: string) {
    return origem === 'RECURRING' ? 'Recorrencia semanal' : 'Remarcacao';
  }

  private traduzirTipoMensagem(tipo: string) {
    return tipo === 'CONFIRMATION' ? 'confirmacao' : 'opcoes_remarcacao';
  }

  private traduzirDirecaoMensagem(direcao: string) {
    return direcao === 'INBOUND' ? 'recebida' : 'enviada';
  }

  private traduzirStatusInteracao(status: string) {
    const map: Record<string, string> = {
      SENT: 'enviada',
      RECEIVED: 'recebida',
      PROCESSED: 'processada',
    };

    return map[status] ?? status.toLowerCase();
  }
}
