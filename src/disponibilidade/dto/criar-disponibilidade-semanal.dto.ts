import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Matches, Max, Min } from 'class-validator';

export class CriarDisponibilidadeSemanalDto {
  @ApiProperty({ example: 1, description: 'Dia da semana da disponibilidade' })
  @IsInt()
  @Min(0)
  @Max(6)
  diaSemana!: number;

  @ApiProperty({ example: '09:00', description: 'Inicio da janela de atendimento' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  horarioInicio!: string;

  @ApiProperty({ example: '17:00', description: 'Fim da janela de atendimento' })
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  horarioFim!: string;

  @ApiProperty({ example: true, required: false, default: true, description: 'Indica se a disponibilidade esta ativa' })
  @IsBoolean()
  ativo = true;
}
