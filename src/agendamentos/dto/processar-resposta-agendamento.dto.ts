import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ProcessarRespostaAgendamentoDto {
  @ApiProperty({
    example: '3',
    enum: ['1', '2', '3'],
    description: '1 = confirmar, 2 = cancelar, 3 = pedir remarcacao',
  })
  @IsOptional()
  @IsString()
  @IsIn(['1', '2', '3'])
  resposta?: '1' | '2' | '3';

  @ApiPropertyOptional({
    example: '3',
    enum: ['1', '2', '3'],
    description: 'Campo legado aceito por compatibilidade',
  })
  @IsOptional()
  @IsString()
  @IsIn(['1', '2', '3'])
  response?: '1' | '2' | '3';
}
