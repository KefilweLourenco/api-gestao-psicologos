import { PartialType } from '@nestjs/swagger';

import { CriarPacienteDto } from './criar-paciente.dto';

export class AtualizarPacienteDto extends PartialType(CriarPacienteDto) {}
