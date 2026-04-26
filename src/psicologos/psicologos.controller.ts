import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CadastrarPsicologoDto } from './dto/cadastrar-psicologo.dto';
import { EntrarPsicologoDto } from './dto/entrar-psicologo.dto';
import { PsicologosService } from './psicologos.service';

@ApiTags('psicologos')
@Controller('psicologos')
export class PsicologosController {
  constructor(private readonly psicologosService: PsicologosService) {}

  @Post('cadastrar')
  cadastrar(@Body() dto: CadastrarPsicologoDto) {
    return this.psicologosService.cadastrar(dto);
  }

  @Post('entrar')
  entrar(@Body() dto: EntrarPsicologoDto) {
    return this.psicologosService.entrar(dto);
  }
}
