import 'dotenv/config'; // Carrega automanticamente as variáveis do arquivo .env 
import 'reflect-metadata'; // Habilita metados usados internamente pelo NestJS e decorators 
import { ValidationPipe } from '@nestjs/common';// Importa o ValidationPipe, usado para validar os dados recebidos pela API 
import { NestFactory } from '@nestjs/core'; // Importa a fábrica que cria a aplicação NestJS
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Importa recursos para gerar a documentação Swagger da API
import { AppModule } from './app.module'; // Importa o módulo principal da aplicação

async function bootstrap() { // Função principal responsável por iniciar a aplicação
  const app = await NestFactory.create(AppModule); // Cria a aplicação NestJS a partir do módulo principal

  app.useGlobalPipes( // Aplica uma validação global para todas as rotas da aplicação 
    new ValidationPipe({ // Cria o pipe de validação que vai verificar os DTOs recebidos
      whitelist: true, // Remove automaticamente campos que não existem no DTO
      forbidNonWhitelisted: true, // Retorna erro se o usuário enviar campos não permitidos
      transform: true, // Converte automaticamente os dados para o tipo esperado quando possível
    }),
  ); // Finaliza a configuração da validação global

  const swaggerConfig = new DocumentBuilder() // Inicia a configuração da documentação Swagger 
    .setTitle('API de Gestao para Psicologos') // Define o título da documentação da API
    .setDescription( 
      'API MVP para gestao de pacientes, confirmacao de sessoes e remarcacao automatica.',
    ) // Define a descrição principal da API no Swagger
    .setVersion('1.0.0') // Define a versão atual da API
    .build(); // Finaliza a configuração do swagger

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig); //Gera o dcooumento Swagger com base na aplicação e nas configurações definas
  SwaggerModule.setup('docs', app, swaggerDocument); //Disponibiliza a documentação Swagger na roda /docs

  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0'); // Inicia o servidor na porta definida no .env ou na 3000 por padrão
                                                                // O endereço 0.0.0.0 permite acessar a aplicação pela rede local
} // Fim da função principal de inicialização 
 
void bootstrap(); // Executa a função que inicia a aplicação
