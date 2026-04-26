import { Injectable } from '@nestjs/common'; //Importa o decorator Injectable, que permite usar esta classe como service no NestJS

import {
  APP_TIMEZONE,
  APPOINTMENT_GENERATION_WEEKS_AHEAD,
  RESCHEDULE_SUGGESTION_LIMIT,
} from './common/constants'; // Importa constantes globais da aplicação, como fuso horário e limites de agendamento
import { obterHtmlPaginaInicial } from './interface/pagina-inicial'; // Importa a função que monta o HTML da página inicial da aplicação

@Injectable() // Marca esta classe como um service que pode ser injetado em outros arquivos
export class AppService { // Declara a classe principal de serviço da aplicação
  obterSaude() { //Método que retorna informações básicas sobre o estado da API
    return { // Retorna um objeto com dados de configuração e funcionamento da aplicação
      status: 'ok', // Informa que a API está funcionamento corretamenta
      fusoHorario: APP_TIMEZONE, // Retorna o fusa horário configurado para a aplicação
      semanasGeracaoAgendamentos: APPOINTMENT_GENERATION_WEEKS_AHEAD, // Informa quantas opções de remarcação a API pode sugerir 
      limiteSugestoesRemarcacao: RESCHEDULE_SUGGESTION_LIMIT, // Informa quantas opções de remarcação a API pode sugerir 
    }; // Fim da rota de saúde
  } // Fim do método de saúde

  obterPaginaInicial() { //Metódo responsável por retornar o HTML da interface principal
    return obterHtmlPaginaInicial(); // Chama a função que gera o HTML da página incial e devolve esse conteúdo
  } // Fim do método da página inicial
} // Fim da classe AppService
