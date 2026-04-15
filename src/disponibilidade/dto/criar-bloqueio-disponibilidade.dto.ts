import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CriarBloqueioDisponibilidadeDto {
  @ApiProperty({ example: '2026-04-15T12:00:00-03:00', description: 'Inicio do bloqueio' })
  @Type(() => Date)
  @IsDate()
  inicio!: Date;

  @ApiProperty({ example: '2026-04-15T16:00:00-03:00', description: 'Fim do bloqueio' })
  @Type(() => Date)
  @IsDate()
  fim!: Date;

  @ApiPropertyOptional({ example: 'Consulta externa', description: 'Motivo do bloqueio' })
  @IsOptional()
  @IsString()
  motivo?: string;
}
