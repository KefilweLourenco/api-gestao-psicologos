import { DisponibilidadeService } from '../src/disponibilidade/disponibilidade.service';

describe('DisponibilidadeService', () => {
  it('retorna apenas horarios livres sem bloqueios ou conflitos', async () => {
    const prisma: any = {
      psychologistAvailability: {
        findMany: jest.fn().mockResolvedValue([
          { weekday: 1, startTime: '09:00', endTime: '12:00', active: true },
        ]),
      },
      availabilityBlock: {
        findMany: jest.fn().mockResolvedValue([
          {
            startAt: new Date('2026-04-13T13:00:00.000Z'),
            endAt: new Date('2026-04-13T14:00:00.000Z'),
          },
        ]),
      },
      appointment: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'a1',
            startsAt: new Date('2026-04-13T09:00:00.000Z'),
            endsAt: new Date('2026-04-13T10:00:00.000Z'),
          },
        ]),
      },
    };

    const service = new DisponibilidadeService(prisma);
    const slots = await service.buscarHorariosDisponiveis({
      inicioBusca: new Date('2026-04-13T08:00:00.000Z'),
      duracaoMinutos: 60,
      limite: 2,
    });

    expect(slots).toHaveLength(2);
    expect(slots[0].inicio.toISOString()).toBe('2026-04-13T12:00:00.000Z');
    expect(slots[1].inicio.toISOString()).toBe('2026-04-13T14:00:00.000Z');
  });
});
