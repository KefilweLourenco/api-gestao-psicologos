import { BadRequestException, Injectable } from '@nestjs/common';

import { overlaps } from '../common/utils/time.utils';
import { PrismaService } from '../prisma/prisma.service';
import { CriarBloqueioDisponibilidadeDto } from './dto/criar-bloqueio-disponibilidade.dto';
import { CriarDisponibilidadeSemanalDto } from './dto/criar-disponibilidade-semanal.dto';

function combineDateAndClock(date: Date, clock: string): Date {
  const [hour, minute] = clock.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hour, minute, 0, 0);
  return combined;
}

@Injectable()
export class DisponibilidadeService {
  constructor(private readonly prisma: PrismaService) {}

  async criarSemanal(dto: CriarDisponibilidadeSemanalDto) {
    if (dto.horarioFim <= dto.horarioInicio) {
      throw new BadRequestException('O horario final precisa ser maior que o horario inicial.');
    }

    const existente = await this.prisma.psychologistAvailability.findFirst({
      where: {
        weekday: dto.diaSemana,
        startTime: dto.horarioInicio,
        endTime: dto.horarioFim,
        active: dto.ativo,
      },
    });

    if (existente) {
      throw new BadRequestException('Essa disponibilidade semanal ja foi cadastrada.');
    }

    const item = await this.prisma.psychologistAvailability.create({
      data: {
        weekday: dto.diaSemana,
        startTime: dto.horarioInicio,
        endTime: dto.horarioFim,
        active: dto.ativo,
      },
    });

    return {
      id: item.id,
      diaSemana: item.weekday,
      diaSemanaDescricao: this.traduzirDiaSemana(item.weekday),
      horarioInicio: item.startTime,
      horarioFim: item.endTime,
      ativo: item.active,
      criadoEm: item.createdAt,
      atualizadoEm: item.updatedAt,
    };
  }

  async listarSemanal() {
    const itens = await this.prisma.psychologistAvailability.findMany({
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
    });

    const mapa = new Map<string, {
      id: string;
      diaSemana: number;
      diaSemanaDescricao: string;
      horarioInicio: string;
      horarioFim: string;
      ativo: boolean;
      criadoEm: Date;
      atualizadoEm: Date;
      repeticoes: number;
    }>();

    for (const item of itens) {
      const chave = `${item.weekday}-${item.startTime}-${item.endTime}-${item.active}`;
      const atual = mapa.get(chave);
      if (atual) {
        atual.repeticoes += 1;
      } else {
        mapa.set(chave, {
          id: item.id,
          diaSemana: item.weekday,
          diaSemanaDescricao: this.traduzirDiaSemana(item.weekday),
          horarioInicio: item.startTime,
          horarioFim: item.endTime,
          ativo: item.active,
          criadoEm: item.createdAt,
          atualizadoEm: item.updatedAt,
          repeticoes: 1,
        });
      }
    }

    return Array.from(mapa.values());
  }

  async criarBloqueio(dto: CriarBloqueioDisponibilidadeDto) {
    if (dto.fim <= dto.inicio) {
      throw new BadRequestException('O fim do bloqueio precisa ser maior que o inicio.');
    }

    const item = await this.prisma.availabilityBlock.create({
      data: {
        startAt: dto.inicio,
        endAt: dto.fim,
        reason: dto.motivo,
      },
    });

    return {
      id: item.id,
      inicio: item.startAt,
      fim: item.endAt,
      motivo: item.reason,
      criadoEm: item.createdAt,
      atualizadoEm: item.updatedAt,
    };
  }

  async listarBloqueios() {
    const itens = await this.prisma.availabilityBlock.findMany({
      orderBy: { startAt: 'asc' },
    });

    return itens.map((item) => ({
      id: item.id,
      inicio: item.startAt,
      fim: item.endAt,
      motivo: item.reason,
      criadoEm: item.createdAt,
      atualizadoEm: item.updatedAt,
    }));
  }

  async buscarHorariosDisponiveis(input: {
    inicioBusca: Date;
    duracaoMinutos: number;
    limite: number;
    ignorarAgendamentoId?: string;
  }) {
    const searchEnd = new Date(input.inicioBusca);
    searchEnd.setDate(searchEnd.getDate() + 30);

    const [weeklyAvailabilities, blocks, appointments] = await Promise.all([
      this.prisma.psychologistAvailability.findMany({
        where: { active: true },
        orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
      }),
      this.prisma.availabilityBlock.findMany({
        where: {
          startAt: { lt: searchEnd },
          endAt: { gt: input.inicioBusca },
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          id: input.ignorarAgendamentoId ? { not: input.ignorarAgendamentoId } : undefined,
          startsAt: { lt: searchEnd },
          endsAt: { gt: input.inicioBusca },
          status: {
            in: ['SCHEDULED', 'CONFIRMATION_PENDING', 'CONFIRMED', 'RESCHEDULE_REQUESTED'],
          },
        },
        select: {
          id: true,
          startsAt: true,
          endsAt: true,
        },
      }),
    ]);

    const horarios: Array<{ inicio: Date; fim: Date }> = [];
    const vistos = new Set<string>();
    for (let offset = 0; offset <= 30 && horarios.length < input.limite; offset += 1) {
      const day = new Date(input.inicioBusca);
      day.setDate(day.getDate() + offset);
      const dayAvailabilities = weeklyAvailabilities.filter(
        (item) => item.weekday === day.getDay(),
      );

      for (const availability of dayAvailabilities) {
        const slotStart = combineDateAndClock(day, availability.startTime);
        const slotEndBoundary = combineDateAndClock(day, availability.endTime);
        let cursor = new Date(slotStart);

        while (cursor < slotEndBoundary && horarios.length < input.limite) {
          const candidateStart = new Date(cursor);
          const candidateEnd = new Date(cursor);
          candidateEnd.setMinutes(candidateEnd.getMinutes() + input.duracaoMinutos);

          if (candidateStart < input.inicioBusca) {
            cursor.setMinutes(cursor.getMinutes() + input.duracaoMinutos);
            continue;
          }

          if (candidateEnd > slotEndBoundary) {
            break;
          }

          const blocked = blocks.some((block) =>
            overlaps(candidateStart, candidateEnd, block.startAt, block.endAt),
          );
          const occupied = appointments.some((appointment) =>
            overlaps(candidateStart, candidateEnd, appointment.startsAt, appointment.endsAt),
          );

          if (!blocked && !occupied) {
            const chave = `${candidateStart.toISOString()}-${candidateEnd.toISOString()}`;
            if (!vistos.has(chave)) {
              vistos.add(chave);
              horarios.push({ inicio: candidateStart, fim: candidateEnd });
            }
          }

          cursor.setMinutes(cursor.getMinutes() + input.duracaoMinutos);
        }
      }
    }

    return horarios;
  }

  private traduzirDiaSemana(diaSemana: number) {
    const mapa = ['Domingo', 'Segunda-feira', 'Terca-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'];
    return mapa[diaSemana] ?? 'Dia invalido';
  }
}
