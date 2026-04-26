import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';
import { CadastrarPsicologoDto } from './dto/cadastrar-psicologo.dto';
import { EntrarPsicologoDto } from './dto/entrar-psicologo.dto';

@Injectable()
export class PsicologosService {
  constructor(private readonly prisma: PrismaService) {}

  async cadastrar(dto: CadastrarPsicologoDto) {
    const email = dto.email.toLowerCase().trim();
    const existente = await this.prisma.psychologist.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existente) {
      throw new BadRequestException('Ja existe um psicologo cadastrado com este e-mail.');
    }

    const senha = this.gerarHashSenha(dto.senha);
    const psicologo = await this.prisma.psychologist.create({
      data: {
        name: dto.nome,
        email,
        passwordHash: senha.hash,
        passwordSalt: senha.salt,
      },
    });

    return {
      mensagem: 'Cadastro criado com sucesso.',
      psicologo: this.formatarPsicologo(psicologo),
    };
  }

  async entrar(dto: EntrarPsicologoDto) {
    const email = dto.email.toLowerCase().trim();
    const psicologo = await this.prisma.psychologist.findUnique({
      where: { email },
    });

    if (!psicologo || !this.senhaCorreta(dto.senha, psicologo.passwordSalt, psicologo.passwordHash)) {
      throw new UnauthorizedException('E-mail ou senha invalidos.');
    }

    return {
      mensagem: 'Login realizado com sucesso.',
      psicologo: this.formatarPsicologo(psicologo),
    };
  }

  private gerarHashSenha(senha: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = this.criarHash(senha, salt);

    return { salt, hash };
  }

  private senhaCorreta(senha: string, salt: string, hashSalvo: string) {
    const hashTentativa = this.criarHash(senha, salt);
    return timingSafeEqual(Buffer.from(hashTentativa), Buffer.from(hashSalvo));
  }

  private criarHash(senha: string, salt: string) {
    return pbkdf2Sync(senha, salt, 100000, 32, 'sha256').toString('hex');
  }

  private formatarPsicologo(psicologo: { id: string; name: string; email: string; createdAt: Date }) {
    return {
      id: psicologo.id,
      nome: psicologo.name,
      email: psicologo.email,
      criadoEm: psicologo.createdAt,
    };
  }
}
