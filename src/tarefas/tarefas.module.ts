import { Module } from '@nestjs/common';

import { AgendamentosModule } from '../agendamentos/agendamentos.module';
import { TarefasService } from './tarefas.service';

@Module({
  imports: [AgendamentosModule],
  providers: [TarefasService],
})
export class TarefasModule {}
