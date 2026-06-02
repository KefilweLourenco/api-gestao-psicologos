// Carrega automaticamente as variaveis do arquivo .env
import 'dotenv/config';
// Habilita metadados usados internamente pelo NestJS e pelos decorators
import 'reflect-metadata';

// Importa o ValidationPipe, usado para validar os dados recebidos pela API
import { ValidationPipe } from '@nestjs/common';
// Importa a fabrica que cria a aplicacao NestJS
import { NestFactory } from '@nestjs/core';
// Importa recursos para gerar a documentacao Swagger da API
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Importa o modulo principal da aplicacao
import { AppModule } from './app.module';

// Funcao principal responsavel por iniciar a aplicacao
async function bootstrap() {
  // Cria a aplicacao NestJS a partir do modulo principal
  const app = await NestFactory.create(AppModule);

  // Aplica uma validacao global para todas as rotas da aplicacao
  app.useGlobalPipes(
    // Cria o pipe de validacao que vai verificar os DTOs recebidos
    new ValidationPipe({
      // Remove automaticamente campos que nao existem no DTO
      whitelist: true,
      // Retorna erro se o usuario enviar campos nao permitidos
      forbidNonWhitelisted: true,
      // Converte automaticamente os dados para o tipo esperado quando possivel
      transform: true,
    }),
  );

  // Inicia a configuracao da documentacao Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API de Gestao para Psicologos')
    .setDescription(
      'API MVP para gestao de pacientes, confirmacao de sessoes e remarcacao automatica.',
    )
    .setVersion('1.0.0')
    .build();

  // Gera o documento Swagger com base na aplicacao e nas configuracoes definidas
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  // Disponibiliza a documentacao Swagger na rota /docs
  SwaggerModule.setup('docs', app, swaggerDocument);

  // Inicia o servidor na porta definida no .env ou na 3000 por padrao
  // O endereco 0.0.0.0 permite acessar a aplicacao pela rede local
  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
}

// Executa a funcao que inicia a aplicacao
void bootstrap();
