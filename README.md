# API de Gestão para Psicólogos

MVP de uma API REST pensada para apoiar psicólogos no controle de pacientes, organização da agenda e fluxo de confirmação e remarcação de sessões.

Este projeto nasceu da minha formação em desenvolvimento fullstack JavaScript, do meu interesse por psicologia e da vontade de construir uma ferramenta realmente útil para profissionais da área. A ideia é evoluir essa base para uma solução que reduza ruído operacional no consultório e torne o processo de remarcação mais simples tanto para o psicólogo quanto para o paciente.

## Visão do projeto

O foco deste primeiro MVP é resolver um fluxo muito comum na prática clínica:

- cadastro de pacientes
- definição do horário recorrente de atendimento
- organização da disponibilidade semanal do psicólogo
- geração automática de agendamentos futuros
- confirmação prévia da sessão
- solicitação de remarcação
- sugestão de novos horários livres
- remarcação automática

Hoje a API trabalha com mensageria simulada, mas a arquitetura já foi preparada para futura integração com SMS ou WhatsApp.

## Funcionalidades implementadas

- CRUD de pacientes
- cadastro de horário recorrente do paciente
- cadastro da disponibilidade semanal do psicólogo
- cadastro de bloqueios de agenda
- geração automática de agendamentos futuros
- envio simulado de confirmação de sessão
- processamento das respostas `1`, `2` e `3`
- fluxo de remarcação com busca de horários disponíveis
- documentação com Swagger
- testes automatizados para regras principais da API

## Stack utilizada

- Node.js
- TypeScript
- NestJS
- Prisma ORM
- MySQL
- Swagger
- Jest

## Estrutura principal

```text
src/
  agendamentos/
  disponibilidade/
  mensageria/
  pacientes/
  prisma/
  tarefas/
```

Os módulos foram organizados em português-BR para deixar a leitura mais clara e coerente com o contexto do projeto.

## Modelagem de domínio

As entidades principais da aplicação são:

- `Patient`: dados do paciente
- `RecurringSchedule`: regra semanal de atendimento
- `Appointment`: sessão concreta gerada pela recorrência
- `PsychologistAvailability`: disponibilidade semanal do psicólogo
- `AvailabilityBlock`: bloqueios pontuais da agenda
- `MessageInteraction`: histórico de mensagens e respostas

## Rotas principais

### Saúde

- `GET /saude`

### Pacientes

- `POST /pacientes`
- `GET /pacientes`
- `GET /pacientes/:id`
- `PATCH /pacientes/:id`
- `DELETE /pacientes/:id`

### Disponibilidade

- `POST /disponibilidade/semanal`
- `GET /disponibilidade/semanal`
- `POST /disponibilidade/bloqueios`
- `GET /disponibilidade/bloqueios`

### Agendamentos

- `POST /agendamentos/gerar`
- `GET /agendamentos`
- `GET /agendamentos/resumo`
- `GET /agendamentos/:id`
- `POST /agendamentos/confirmacoes/enviar`
- `POST /agendamentos/:id/respostas`
- `POST /agendamentos/:id/escolha-remarcacao`

## Como rodar o projeto localmente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd new-project
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Crie o arquivo `.env`

Use o arquivo `.env.example` como base:

```env
DATABASE_URL="mysql://root:password@localhost:3306/psychology_mvp"
PORT=3000
APP_TIMEZONE="America/Sao_Paulo"
APPOINTMENT_GENERATION_WEEKS_AHEAD=6
RESCHEDULE_SUGGESTION_LIMIT=3
```

### 4. Crie o banco no MySQL

```sql
CREATE DATABASE psychology_mvp;
```

### 5. Rode as migrations

```bash
npx prisma migrate dev
```

### 6. Inicie a aplicação

```bash
npm run start:dev
```

### 7. Acesse a documentação

```text
http://localhost:3000/docs
```

## Como testar

Você pode testar a API de duas formas:

- pelo Swagger
- pelo Insomnia

Fluxo básico de teste:

1. cadastrar disponibilidade semanal
2. cadastrar paciente
3. gerar agendamentos futuros
4. listar agendamentos
5. solicitar remarcação com resposta `3`
6. escolher um novo horário sugerido

## Scripts disponíveis

```bash
npm run start:dev
npm run build
npm test
npx prisma migrate dev
npx prisma studio
```

## Status do projeto

Este projeto está em fase inicial, mas já possui uma base funcional de API para agenda clínica com foco em confirmação e remarcação.

Próximos passos que pretendo desenvolver:

- autenticação de usuários
- integração real com WhatsApp ou SMS
- painel web para psicólogos
- filtros e paginação mais completos
- melhoria dos retornos padronizados da API
- preparação para multiusuário

## Motivação pessoal

Além da formação em desenvolvimento fullstack JavaScript, eu também estudo psicologia. Isso fez com que eu olhasse para esse problema com bastante interesse: quero construir uma ferramenta que faça sentido na prática clínica e que seja útil para profissionais como a minha esposa.

Mais do que um exercício técnico, este projeto representa um começo de produto com propósito real.

## Autor

Projeto desenvolvido por **Kefilwe Lourenço** como parte do meu portfólio de desenvolvimento fullstack JavaScript, com foco em backend, regras de negócio e construção de soluções úteis para a área da saúde mental.

Projeto idealizado, validado e evoluído por mim como parte do meu portfólio de desenvolvimento fullstack JavaScript, com apoio de ferramentas de IA no processo de prototipação e refatoração.
