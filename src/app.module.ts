// Importa o decorator Module, usado para definir um modulo no NestJS
import { Module } from '@nestjs/common';
// Importa o modulo de agendamento de tarefas automaticas
import { ScheduleModule } from '@nestjs/schedule';

// Importa o modulo responsavel pelas regras e rotas de agendamentos
import { AgendamentosModule } from './agendamentos/agendamentos.module';
// Importa o controller principal da aplicacao
import { AppController } from './app.controller';
// Importa o service principal da aplicacao
import { AppService } from './app.service';
// Importa o modulo responsavel pela disponibilidade do psicologo
import { DisponibilidadeModule } from './disponibilidade/disponibilidade.module';
// Importa o modulo que executa tarefas automaticas do sistema
import { TarefasModule } from './tarefas/tarefas.module';
// Importa o modulo responsavel pelo envio e registro de mensagens
import { MensageriaModule } from './mensageria/mensageria.module';
// Importa o modulo responsavel pelo CRUD de pacientes
import { PacientesModule } from './pacientes/pacientes.module';
// Importa o modulo que centraliza a conexao com o banco via Prisma
import { PrismaModule } from './prisma/prisma.module';
// Importa o modulo responsavel pelo cadastro e login do psicologo
import { PsicologosModule } from './psicologos/psicologos.module';

// Define o modulo principal da aplicacao
@Module({
  // Lista os modulos que fazem parte da aplicacao
  imports: [
    // Inicializa o sistema de tarefas agendadas do NestJS
    ScheduleModule.forRoot(),
    PrismaModule,
    MensageriaModule,
    PsicologosModule,
    PacientesModule,
    DisponibilidadeModule,
    AgendamentosModule,
    TarefasModule,
  ],
  // Registra o controller principal da aplicacao
  controllers: [AppController],
  // Registra o service principal da aplicacao
  providers: [AppService],
})
// Exporta a classe do modulo principal da aplicacao
export class AppModule {}
