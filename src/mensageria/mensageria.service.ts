import { Injectable } from '@nestjs/common';
import { MessageDirection, MessageStatus, Prisma } from '@prisma/client';

import { MessageKindValue } from '../common/enums';
import { PrismaService } from '../prisma/prisma.service';
import { ProvedorMensageriaSimulado } from './provedor-mensageria-simulado';
import { EnviarMensagemPayload } from './mensageria.tipos';

@Injectable()
export class MensageriaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly provider: ProvedorMensageriaSimulado,
  ) {}

  async enviarERastrearMensagem(payload: EnviarMensagemPayload) {
    const resultadoEnvio = await this.provider.enviarMensagem(payload);

    return this.prisma.messageInteraction.create({
      data: {
        appointmentId: payload.idAgendamento,
        kind: payload.tipo,
        direction: MessageDirection.OUTBOUND,
        status: MessageStatus.SENT,
        provider: resultadoEnvio.provedor,
        channel: 'whatsapp',
        content: payload.conteudo,
        metadata: {
          ...(payload.metadados ?? {}),
          externalId: resultadoEnvio.idExterno,
        } satisfies Prisma.JsonObject,
      },
    });
  }

  async registrarInteracaoRecebida(input: {
    idAgendamento: string;
    tipo: MessageKindValue;
    conteudo: string;
    codigoResposta?: string;
    metadados?: Prisma.JsonObject;
  }) {
    return this.prisma.messageInteraction.create({
      data: {
        appointmentId: input.idAgendamento,
        kind: input.tipo,
        direction: MessageDirection.INBOUND,
        status: MessageStatus.RECEIVED,
        provider: 'mock',
        channel: 'whatsapp',
        content: input.conteudo,
        responseCode: input.codigoResposta,
        metadata: input.metadados,
      },
    });
  }

  async marcarComoProcessada(idInteracao: string) {
    return this.prisma.messageInteraction.update({
      where: { id: idInteracao },
      data: { status: MessageStatus.PROCESSED },
    });
  }
}
