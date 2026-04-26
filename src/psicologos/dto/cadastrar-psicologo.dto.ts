import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CadastrarPsicologoDto {
  @ApiProperty({ example: 'Dra. Ana Ribeiro' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({ example: 'ana@clinica.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  senha!: string;
}
