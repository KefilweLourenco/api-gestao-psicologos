import { MessageKindValue } from '../common/enums';

export interface EnviarMensagemPayload {
  idAgendamento: string;
  telefone: string;
  conteudo: string;
  tipo: MessageKindValue;
  metadados?: Record<string, unknown>;
}

export interface ResultadoEnvioMensagem {
  provedor: string;
  idExterno: string;
}

export interface ProvedorMensageria {
  enviarMensagem(payload: EnviarMensagemPayload): Promise<ResultadoEnvioMensagem>;
}
