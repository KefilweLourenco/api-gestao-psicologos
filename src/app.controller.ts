import { Controller, Get, Header } from '@nestjs/common'; // Importa decorators do NestJS para criar rotas e definir cabeçalhos de resposta
import { ApiTags } from '@nestjs/swagger'; // Importa o decorator usado para agrupar as rotas na documentação Swagger
import { AppService } from './app.service'; // Importa a service principal que contém a lógica usada neste controller

@ApiTags('saude') // Agru´p essas rotas na seção "saude" dentro do Swagger
@Controller() // Define este arquivo como um controller da aplicação
export class AppController { // Declara a classe do controller principal
  constructor(private readonly appService: AppService) {} // Injeta o AppService para que o controller possa usar métodos dele

  @Get() // Define uma rota GET na raiz da aplicação: "/"
  @Header('Content-Type', 'text/html; charset=utf-8') // Define que a resposta dessa rota será HTML em UTF-8
  obterPaginaInicial() { // Método responsável por devolver a página inicial da aplicação
    return this.appService.obterPaginaInicial(); // Chama a service para retorna o HTML da interface inicial
  } // Fim da rota inicial

  @Get('saude') // Define uma rota GET em "/saude"
  obterSaude() { // Método responsável por retornar o status de saúde da API
    return this.appService.obterSaude(); // Chama o service para devolver informações báscias da aplicação
  } // fim da rota saúde
} // Fim da classe AppController
