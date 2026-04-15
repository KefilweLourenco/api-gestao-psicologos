import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Matches, Max, Min } from 'class-validator';

export class HorarioRecorrenteDto {
  @ApiProperty({ example: 2, description: '0 = domingo, 1 = segunda, 2 = terca, ... 6 = sabado' })
  @IsInt()
  @Min(0)
  @Max(6)
  diaSemana!: number;

  @ApiProperty({ example: '10:00', description: 'Horario fixo semanal do atendimento' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  horarioInicio!: string;

  @ApiProperty({ example: 50, description: 'Duracao da sessao em minutos' })
  @IsInt()
  @Min(30)
  @Max(180)
  duracaoMinutos!: number;

  @ApiProperty({ example: true, required: false, default: true, description: 'Indica se a recorrencia esta ativa' })
  @IsBoolean()
  ativo = true;
}
