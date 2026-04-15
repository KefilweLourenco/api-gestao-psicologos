import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

import { ProcessarRespostaAgendamentoDto } from './dto/processar-resposta-agendamento.dto';
import { SelecionarHorarioRemarcacaoDto } from './dto/selecionar-horario-remarcacao.dto';
import { AgendamentosService } from './agendamentos.service';

@ApiTags('agendamentos')
@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @ApiQuery({ name: 'status', required: false, enum: AppointmentStatus })
  @ApiQuery({ name: 'idPaciente', required: false, type: String })
  @ApiQuery({ name: 'limite', required: false, type: Number, example: 10 })
  @Get('resumo')
  listarResumo(
    @Query('status') status?: AppointmentStatus,
    @Query('idPaciente') idPaciente?: string,
    @Query('limite') limite?: string,
  ) {
    return this.agendamentosService.listarResumo({
      status,
      patientId: idPaciente,
      limit: limite ? Number(limite) : undefined,
    });
  }

  @Get()
  listar() {
    return this.agendamentosService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.agendamentosService.buscarPorId(id);
  }

  @Post('gerar')
  gerar() {
    return this.agendamentosService.gerarAgendamentosFuturos();
  }

  @Post('confirmacoes/enviar')
  enviarConfirmacoes() {
    return this.agendamentosService.enviarConfirmacoesPendentes();
  }

  @Post(':id/respostas')
  processarResposta(@Param('id') id: string, @Body() dto: ProcessarRespostaAgendamentoDto) {
    return this.agendamentosService.processarResposta(id, dto.resposta ?? dto.response!);
  }

  @Post(':id/escolha-remarcacao')
  selecionarHorarioRemarcacao(
    @Param('id') id: string,
    @Body() dto: SelecionarHorarioRemarcacaoDto,
  ) {
    return this.agendamentosService.selecionarHorarioRemarcacao(id, dto.inicio ?? dto.startAt!);
  }
}
