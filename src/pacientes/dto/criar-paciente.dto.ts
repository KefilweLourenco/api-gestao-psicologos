import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';

import { HorarioRecorrenteDto } from './horario-recorrente.dto';

export class CriarPacienteDto {
  @ApiProperty({ example: 'Maria Silva', description: 'Nome completo da paciente' })
  @IsString()
  @IsNotEmpty()
  nomeCompleto!: string;

  @ApiProperty({ example: '+5511998888777', description: 'Telefone principal com DDI e DDD' })
  @IsPhoneNumber('BR')
  telefone!: string;

  @ApiPropertyOptional({ example: 'maria@example.com', description: 'E-mail para contato' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Paciente prefere contato por WhatsApp.' })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiProperty({ type: HorarioRecorrenteDto, description: 'Horario fixo semanal da paciente' })
  @ValidateNested()
  @Type(() => HorarioRecorrenteDto)
  horarioRecorrente!: HorarioRecorrenteDto;
}
