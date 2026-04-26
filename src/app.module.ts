import { Module } from '@nestjs/common'; // Importa o decorator Module, usado para definir um módulo no NestJS
import { ScheduleModule } from '@nestjs/schedule';  // Importa o módulo de agendamento de tarefas autómaticas
import { AgendamentosModule } from './agendamentos/agendamentos.module'; // Importa o módulo responsável pelas regras e rotas de agendamentos
import { AppController } from './app.controller'; // Importa o Controller principal da aplicação
import { AppService } from './app.service'; // Importa o service principal da aplicação
import { DisponibilidadeModule } from './disponibilidade/disponibilidade.module'; // Importa o módulo responsável pela disponibilidade do psicológo
import { TarefasModule } from './tarefas/tarefas.module'; // Importa o módulo que executa tarefas automáticas do sistema
import { MensageriaModule } from './mensageria/mensageria.module'; // Importa o módulo responsável pelo envio e registro de mensagens
import { PacientesModule } from './pacientes/pacientes.module'; // Importa o módulo responsável pelo CRUD de pacientes
import { PrismaModule } from './prisma/prisma.module'; // Importa o módulo que centraliza a conexão com o banco via Prisma 
import { PsicologosModule } from './psicologos/psicologos.module'; // Importa o módulo responsável pelo cadastro e login do psicólogo

@Module({ // Define o módulo principal da aplicação
  imports: [ // Lista os módulos que fazem parte da aplicação
    ScheduleModule.forRoot(), // Inicializa o sistema de tarefas agendados do NestJS
    PrismaModule, // Adiciona o módulo de acesso ao banco de dados
    MensageriaModule, // Módulo de mensageria
    PsicologosModule,  // Módulo de psicólogos
    PacientesModule,  // Módulo de pacientes
    DisponibilidadeModule, // Adiciona módulo de disponibilidade
    AgendamentosModule,  // Módulo de agendamentos
    TarefasModule, // Módulo de tarefas
  ], // Fim da lista de módulos importados
  controllers: [AppController],  // Registra o controller principal da aplicação
  providers: [AppService], // Registra o service principal da aplicação
}) // Finaliza a configuração do módulo principal
export class AppModule {}  // Exporta a classe do módulo principal da aplicação
