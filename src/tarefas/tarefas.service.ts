import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AgendamentosService } from '../agendamentos/agendamentos.service';

@Injectable()
export class TarefasService {
  private readonly logger = new Logger(TarefasService.name);

  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async gerarAgendamentos() {
    const result = await this.agendamentosService.gerarAgendamentosFuturos();
    this.logger.log(`Foram gerados ${result.quantidadeCriada} agendamentos futuros.`);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async enviarConfirmacoes() {
    const result = await this.agendamentosService.enviarConfirmacoesPendentes();
    this.logger.log(`Foram enviadas ${result.quantidadeEnviada} confirmacoes.`);
  }
}
