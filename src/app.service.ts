// Importa o decorator Injectable, que permite usar esta classe como service no NestJS
import { Injectable } from '@nestjs/common';

// Importa constantes globais da aplicacao, como fuso horario e limites de agendamento
import {
  APP_TIMEZONE,
  APPOINTMENT_GENERATION_WEEKS_AHEAD,
  RESCHEDULE_SUGGESTION_LIMIT,
} from './common/constants';
// Importa a funcao que monta o HTML da pagina inicial da aplicacao
import { obterHtmlPaginaInicial } from './interface/pagina-inicial';

// Marca esta classe como um service que pode ser injetado em outros arquivos
@Injectable()
// Declara a classe principal de servico da aplicacao
export class AppService {
  // Metodo que retorna informacoes basicas sobre o estado da API
  obterSaude() {
    return {
      status: 'ok',
      fusoHorario: APP_TIMEZONE,
      semanasGeracaoAgendamentos: APPOINTMENT_GENERATION_WEEKS_AHEAD,
      limiteSugestoesRemarcacao: RESCHEDULE_SUGGESTION_LIMIT,
    };
  }

  // Metodo responsavel por retornar o HTML da interface principal
  obterPaginaInicial() {
    return obterHtmlPaginaInicial();
  }
}
