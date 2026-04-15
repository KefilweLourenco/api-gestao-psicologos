import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class SelecionarHorarioRemarcacaoDto {
  @ApiProperty({ example: '2026-04-17T10:00:00-03:00', description: 'Horario escolhido entre as opcoes sugeridas' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  inicio?: Date;

  @ApiPropertyOptional({
    example: '2026-04-17T10:00:00-03:00',
    description: 'Campo legado aceito por compatibilidade',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startAt?: Date;
}
