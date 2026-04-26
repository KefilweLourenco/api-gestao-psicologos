import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { PsicologosController } from './psicologos.controller';
import { PsicologosService } from './psicologos.service';

@Module({
  imports: [PrismaModule],
  controllers: [PsicologosController],
  providers: [PsicologosService],
})
export class PsicologosModule {}
