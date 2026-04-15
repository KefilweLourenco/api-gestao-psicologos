import { Global, Module } from '@nestjs/common';

import { MensageriaService } from './mensageria.service';
import { ProvedorMensageriaSimulado } from './provedor-mensageria-simulado';

@Global()
@Module({
  providers: [ProvedorMensageriaSimulado, MensageriaService],
  exports: [MensageriaService, ProvedorMensageriaSimulado],
})
export class MensageriaModule {}
