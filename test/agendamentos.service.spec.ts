import { AppointmentStatus, MessageKind } from '@prisma/client';

import { AgendamentosService } from '../src/agendamentos/agendamentos.service';

describe('AgendamentosService', () => {
  it('confirma a sessao quando a paciente responde 1', async () => {
    const appointment = {
      id: 'appt-1',
      patientId: 'patient-1',
      recurringScheduleId: 'schedule-1',
      startsAt: new Date('2026-04-15T13:00:00.000Z'),
      endsAt: new Date('2026-04-15T14:00:00.000Z'),
      status: AppointmentStatus.CONFIRMATION_PENDING,
      patient: { id: 'patient-1', phoneNumber: '+5511999999999' },
      recurringSchedule: {
        id: 'schedule-1',
        patientId: 'patient-1',
        weekday: 3,
        startTime: '10:00',
        durationMinutes: 60,
        active: true,
      },
      messageInteractions: [],
    };

    const prisma: any = {
      appointment: {
        findUnique: jest.fn().mockResolvedValue(appointment),
        update: jest.fn().mockResolvedValue({
          ...appointment,
          status: AppointmentStatus.CONFIRMED,
        }),
      },
    };

    const availabilityService: any = {
      buscarHorariosDisponiveis: jest.fn(),
    };

    const messagingService: any = {
      registrarInteracaoRecebida: jest.fn().mockResolvedValue({ id: 'msg-1' }),
      marcarComoProcessada: jest.fn().mockResolvedValue({}),
      enviarERastrearMensagem: jest.fn(),
    };

    const service = new AgendamentosService(prisma, availabilityService, messagingService);
    const result = await service.processarResposta('appt-1', '1');

    expect(result.acao).toBe('confirmado');
    expect(prisma.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: AppointmentStatus.CONFIRMED,
        }),
      }),
    );
    expect(messagingService.marcarComoProcessada).toHaveBeenCalledWith('msg-1');
  });

  it('oferece opcoes de remarcacao quando a paciente responde 3', async () => {
    const appointment = {
      id: 'appt-2',
      patientId: 'patient-1',
      recurringScheduleId: 'schedule-1',
      startsAt: new Date('2026-04-15T13:00:00.000Z'),
      endsAt: new Date('2026-04-15T14:00:00.000Z'),
      status: AppointmentStatus.CONFIRMATION_PENDING,
      patient: { id: 'patient-1', phoneNumber: '+5511999999999' },
      recurringSchedule: {
        id: 'schedule-1',
        patientId: 'patient-1',
        weekday: 3,
        startTime: '10:00',
        durationMinutes: 60,
        active: true,
      },
      messageInteractions: [],
    };

    const prisma: any = {
      appointment: {
        findUnique: jest.fn().mockResolvedValue(appointment),
        update: jest.fn().mockResolvedValue({
          ...appointment,
          status: AppointmentStatus.RESCHEDULE_REQUESTED,
        }),
      },
    };

    const availabilityService: any = {
      buscarHorariosDisponiveis: jest.fn().mockResolvedValue([
        {
          inicio: new Date('2026-04-17T13:00:00.000Z'),
          fim: new Date('2026-04-17T14:00:00.000Z'),
        },
      ]),
    };

    const messagingService: any = {
      registrarInteracaoRecebida: jest.fn().mockResolvedValue({ id: 'msg-1' }),
      marcarComoProcessada: jest.fn().mockResolvedValue({}),
      enviarERastrearMensagem: jest.fn().mockResolvedValue({ id: 'msg-2' }),
    };

    const service = new AgendamentosService(prisma, availabilityService, messagingService);
    const result = await service.processarResposta('appt-2', '3');

    expect(result.acao).toBe('remarcacao_solicitada');
    expect(availabilityService.buscarHorariosDisponiveis).toHaveBeenCalled();
    expect(messagingService.enviarERastrearMensagem).toHaveBeenCalledWith(
      expect.objectContaining({
        idAgendamento: 'appt-2',
        tipo: 'RESCHEDULE_OPTIONS',
      }),
    );
    expect(messagingService.marcarComoProcessada).toHaveBeenCalledWith('msg-1');
  });

  it('cria um novo agendamento quando um horario valido e escolhido para remarcacao', async () => {
    const appointment = {
      id: 'appt-3',
      patientId: 'patient-1',
      recurringScheduleId: 'schedule-1',
      startsAt: new Date('2026-04-15T13:00:00.000Z'),
      endsAt: new Date('2026-04-15T14:00:00.000Z'),
      status: AppointmentStatus.RESCHEDULE_REQUESTED,
      patient: { id: 'patient-1', phoneNumber: '+5511999999999' },
      recurringSchedule: {
        id: 'schedule-1',
        patientId: 'patient-1',
        weekday: 3,
        startTime: '10:00',
        durationMinutes: 60,
        active: true,
      },
      messageInteractions: [
        {
          kind: MessageKind.RESCHEDULE_OPTIONS,
          metadata: {
            options: [
              {
                startAt: '2026-04-17T13:00:00.000Z',
                endAt: '2026-04-17T14:00:00.000Z',
              },
            ],
          },
        },
      ],
    };

    const tx = {
      messageInteraction: {
        create: jest.fn().mockResolvedValue({ id: 'msg-3' }),
      },
      appointment: {
        update: jest.fn().mockResolvedValue({
          ...appointment,
          status: AppointmentStatus.RESCHEDULED,
        }),
        create: jest.fn().mockResolvedValue({
          id: 'appt-new',
          startsAt: new Date('2026-04-17T13:00:00.000Z'),
          endsAt: new Date('2026-04-17T14:00:00.000Z'),
          source: 'RESCHEDULE',
        }),
      },
    };

    const prisma: any = {
      appointment: {
        findUnique: jest.fn().mockResolvedValue(appointment),
        findFirst: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(null),
      },
      $transaction: jest.fn().mockImplementation(async (callback: (client: typeof tx) => Promise<unknown>) =>
        callback(tx),
      ),
    };

    const availabilityService: any = {
      buscarHorariosDisponiveis: jest.fn(),
    };

    const messagingService: any = {
      registrarInteracaoRecebida: jest.fn(),
      marcarComoProcessada: jest.fn(),
      enviarERastrearMensagem: jest.fn(),
    };

    const service = new AgendamentosService(prisma, availabilityService, messagingService);
    const result = await service.selecionarHorarioRemarcacao(
      'appt-3',
      new Date('2026-04-17T13:00:00.000Z'),
    );

    expect(result.novoAgendamento.id).toBe('appt-new');
    expect(tx.appointment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: AppointmentStatus.RESCHEDULED,
        }),
      }),
    );
    expect(tx.messageInteraction.create).toHaveBeenCalled();
  });
});
