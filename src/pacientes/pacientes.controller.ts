import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CriarPacienteDto } from './dto/criar-paciente.dto';
import { AtualizarPacienteDto } from './dto/atualizar-paciente.dto';
import { PacientesService } from './pacientes.service';

@ApiTags('pacientes')
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  criar(@Body() dto: CriarPacienteDto) {
    return this.pacientesService.criar(dto);
  }

  @Get()
  listar() {
    return this.pacientesService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.pacientesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarPacienteDto) {
    return this.pacientesService.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.pacientesService.remover(id);
  }
}
