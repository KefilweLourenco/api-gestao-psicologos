import { Injectable } from '@nestjs/common';

import {
  APP_TIMEZONE,
  APPOINTMENT_GENERATION_WEEKS_AHEAD,
  RESCHEDULE_SUGGESTION_LIMIT,
} from './common/constants';

@Injectable()
export class AppService {
  obterSaude() {
    return {
      status: 'ok',
      fusoHorario: APP_TIMEZONE,
      semanasGeracaoAgendamentos: APPOINTMENT_GENERATION_WEEKS_AHEAD,
      limiteSugestoesRemarcacao: RESCHEDULE_SUGGESTION_LIMIT,
    };
  }
}
