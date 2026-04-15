import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CriarPacienteDto } from './dto/criar-paciente.dto';
import { AtualizarPacienteDto } from './dto/atualizar-paciente.dto';

const patientInclude = {
  recurringSchedule: true,
  appointments: {
    orderBy: {
      startsAt: 'asc',
    },
    take: 10,
  },
} satisfies Prisma.PatientInclude;

@Injectable()
export class PacientesService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarPacienteDto) {
    const paciente = await this.prisma.patient.create({
      data: {
        fullName: dto.nomeCompleto,
        phoneNumber: dto.telefone,
        email: dto.email,
        notes: dto.observacoes,
        recurringSchedule: {
          create: {
            weekday: dto.horarioRecorrente.diaSemana,
            startTime: dto.horarioRecorrente.horarioInicio,
            durationMinutes: dto.horarioRecorrente.duracaoMinutos,
            active: dto.horarioRecorrente.ativo,
          },
        },
      },
      include: patientInclude,
    });

    return this.formatarPaciente(paciente);
  }

  async listar() {
    const pacientes = await this.prisma.patient.findMany({
      include: patientInclude,
      orderBy: {
        fullName: 'asc',
      },
    });

    return pacientes.map((paciente) => this.formatarPaciente(paciente));
  }

  async buscarPorId(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: patientInclude,
    });
    if (!patient) {
      throw new NotFoundException(`Paciente ${id} nao encontrado.`);
    }

    return this.formatarPaciente(patient);
  }

  async atualizar(id: string, dto: AtualizarPacienteDto) {
    await this.garantirQueExiste(id);

    const patchHorario = dto.horarioRecorrente
      ? {
          upsert: {
            create: {
              weekday: dto.horarioRecorrente.diaSemana,
              startTime: dto.horarioRecorrente.horarioInicio,
              durationMinutes: dto.horarioRecorrente.duracaoMinutos,
              active: dto.horarioRecorrente.ativo,
            },
            update: {
              weekday: dto.horarioRecorrente.diaSemana,
              startTime: dto.horarioRecorrente.horarioInicio,
              durationMinutes: dto.horarioRecorrente.duracaoMinutos,
              active: dto.horarioRecorrente.ativo,
            },
          },
        }
      : undefined;

    const paciente = await this.prisma.patient.update({
      where: { id },
      data: {
        fullName: dto.nomeCompleto,
        phoneNumber: dto.telefone,
        email: dto.email,
        notes: dto.observacoes,
        recurringSchedule: patchHorario,
      },
      include: patientInclude,
    });

    return this.formatarPaciente(paciente);
  }

  async remover(id: string) {
    await this.garantirQueExiste(id);
    return this.prisma.patient.delete({
      where: { id },
    });
  }

  private async garantirQueExiste(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!patient) {
      throw new NotFoundException(`Paciente ${id} nao encontrado.`);
    }
  }

  private formatarPaciente(
    paciente: Prisma.PatientGetPayload<{ include: typeof patientInclude }>,
  ) {
    return {
      id: paciente.id,
      nomeCompleto: paciente.fullName,
      telefone: paciente.phoneNumber,
      email: paciente.email,
      observacoes: paciente.notes,
      criadoEm: paciente.createdAt,
      atualizadoEm: paciente.updatedAt,
      horarioRecorrente: paciente.recurringSchedule
        ? {
            id: paciente.recurringSchedule.id,
            diaSemana: paciente.recurringSchedule.weekday,
            horarioInicio: paciente.recurringSchedule.startTime,
            duracaoMinutos: paciente.recurringSchedule.durationMinutes,
            ativo: paciente.recurringSchedule.active,
            criadoEm: paciente.recurringSchedule.createdAt,
            atualizadoEm: paciente.recurringSchedule.updatedAt,
          }
        : null,
      proximosAgendamentos: paciente.appointments.map((agendamento) => ({
        id: agendamento.id,
        inicio: agendamento.startsAt,
        fim: agendamento.endsAt,
        status: agendamento.status,
      })),
    };
  }
}
