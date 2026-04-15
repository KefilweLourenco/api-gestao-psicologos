import { Injectable, Logger } from '@nestjs/common';

import { EnviarMensagemPayload, ProvedorMensageria, ResultadoEnvioMensagem } from './mensageria.tipos';

@Injectable()
export class ProvedorMensageriaSimulado implements ProvedorMensageria {
  private readonly logger = new Logger(ProvedorMensageriaSimulado.name);

  async enviarMensagem(payload: EnviarMensagemPayload): Promise<ResultadoEnvioMensagem> {
    const idExterno = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.logger.log(
      `Mensagem simulada enviada para ${payload.telefone} no agendamento ${payload.idAgendamento}: ${payload.conteudo}`,
    );

    return {
      provedor: 'mock',
      idExterno,
    };
  }
}
