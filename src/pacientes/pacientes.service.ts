// Importa o decorator Injectable e a excecao NotFoundException do NestJS
import { Injectable, NotFoundException } from '@nestjs/common';
// Importa tipos do Prisma para ajudar na tipagem dos dados do banco
import { Prisma } from '@prisma/client';
// Importa o service que faz a conexao com o banco de dados usando Prisma
import { PrismaService } from '../prisma/prisma.service';
// Importa o DTO usado para criar um novo paciente
import { CriarPacienteDto } from './dto/criar-paciente.dto';
// Importa o DTO usado para atualizar os dados de um paciente
import { AtualizarPacienteDto } from './dto/atualizar-paciente.dto';

// Define quais relacionamentos do paciente devem ser buscados junto com ele
const patientInclude = {
  // Inclui o horario recorrente do paciente na consulta
  recurringSchedule: true,
  // Inclui os agendamentos do paciente na consulta
  appointments: {
    orderBy: {
      startsAt: 'asc',
    },
    // Limita a consulta aos 10 proximos agendamentos
    take: 10,
  },
} satisfies Prisma.PatientInclude;

// Marca essa classe como um service que pode ser injetado em outros arquivos
@Injectable()
// Declara a classe responsavel pelas regras de negocio dos pacientes
export class PacientesService {
  // Injeta o PrismaService para permitir acesso ao banco de dados
  constructor(private readonly prisma: PrismaService) {}

  // Cria um novo paciente no banco usando os dados recebidos no DTO
  async criar(dto: CriarPacienteDto) {
    // Cria um novo registro na tabela de pacientes
    const paciente = await this.prisma.patient.create({
      // Define os dados que serao salvos no banco
      data: {
        fullName: dto.nomeCompleto,
        phoneNumber: dto.telefone,
        email: dto.email,
        notes: dto.observacoes,
        // Cria tambem o horario recorrente do paciente junto com o cadastro
        recurringSchedule: {
          create: {
            weekday: dto.horarioRecorrente.diaSemana,
            startTime: dto.horarioRecorrente.horarioInicio,
            durationMinutes: dto.horarioRecorrente.duracaoMinutos,
            active: dto.horarioRecorrente.ativo,
          },
        },
      },
      // Retorna o paciente ja incluindo o horario recorrente e os proximos agendamentos
      include: patientInclude,
    });

    // Retorna o paciente ja formatado no padrao da API
    return this.formatarPaciente(paciente);
  }

  // Lista todos os pacientes ordenados por nome
  async listar() {
    const pacientes = await this.prisma.patient.findMany({
      include: patientInclude,
      orderBy: {
        fullName: 'asc',
      },
    });

    return pacientes.map((paciente) => this.formatarPaciente(paciente));
  }

  // Busca um paciente especifico pelo id
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

  // Atualiza os dados de um paciente e do horario recorrente vinculado a ele
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

  // Remove um paciente do banco
  async remover(id: string) {
    await this.garantirQueExiste(id);

    return this.prisma.patient.delete({
      where: { id },
    });
  }

  // Verifica se o paciente existe antes de atualizar ou remover
  private async garantirQueExiste(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente ${id} nao encontrado.`);
    }
  }

  // Converte os nomes internos do banco para o formato de resposta da API
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
