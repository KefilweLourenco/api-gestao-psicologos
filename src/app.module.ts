import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DisponibilidadeModule } from './disponibilidade/disponibilidade.module';
import { TarefasModule } from './tarefas/tarefas.module';
import { MensageriaModule } from './mensageria/mensageria.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    MensageriaModule,
    PacientesModule,
    DisponibilidadeModule,
    AgendamentosModule,
    TarefasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
