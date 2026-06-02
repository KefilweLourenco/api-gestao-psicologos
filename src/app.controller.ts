// Importa decorators do NestJS para criar rotas e definir cabecalhos de resposta
import { Controller, Get, Header } from '@nestjs/common';
// Importa o decorator usado para agrupar as rotas na documentacao Swagger
import { ApiTags } from '@nestjs/swagger';

// Importa o service principal que contem a logica usada neste controller
import { AppService } from './app.service';

// Agrupa essas rotas na secao "saude" dentro do Swagger
@ApiTags('saude')
// Define este arquivo como um controller da aplicacao
@Controller()
// Declara a classe do controller principal
export class AppController {
  // Injeta o AppService para que o controller possa usar os metodos dele
  constructor(private readonly appService: AppService) {}

  // Define uma rota GET na raiz da aplicacao: "/"
  @Get()
  // Define que a resposta dessa rota sera HTML em UTF-8
  @Header('Content-Type', 'text/html; charset=utf-8')
  // Metodo responsavel por devolver a pagina inicial da aplicacao
  obterPaginaInicial() {
    return this.appService.obterPaginaInicial();
  }

  // Define uma rota GET em "/saude"
  @Get('saude')
  // Metodo responsavel por retornar o status de saude da API
  obterSaude() {
    return this.appService.obterSaude();
  }
}
