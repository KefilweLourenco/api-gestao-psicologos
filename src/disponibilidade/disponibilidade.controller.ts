import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CriarBloqueioDisponibilidadeDto } from './dto/criar-bloqueio-disponibilidade.dto';
import { CriarDisponibilidadeSemanalDto } from './dto/criar-disponibilidade-semanal.dto';
import { DisponibilidadeService } from './disponibilidade.service';

@ApiTags('disponibilidade')
@Controller('disponibilidade')
export class DisponibilidadeController {
  constructor(private readonly disponibilidadeService: DisponibilidadeService) {}

  @Post('semanal')
  criarSemanal(@Body() dto: CriarDisponibilidadeSemanalDto) {
    return this.disponibilidadeService.criarSemanal(dto);
  }

  @Get('semanal')
  listarSemanal() {
    return this.disponibilidadeService.listarSemanal();
  }

  @Post('bloqueios')
  criarBloqueio(@Body() dto: CriarBloqueioDisponibilidadeDto) {
    return this.disponibilidadeService.criarBloqueio(dto);
  }

  @Get('bloqueios')
  listarBloqueios() {
    return this.disponibilidadeService.listarBloqueios();
  }
}
