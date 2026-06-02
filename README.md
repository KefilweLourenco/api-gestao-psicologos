# API Gestão de Psicólogos

API backend desenvolvida para auxiliar na gestão de atendimentos psicológicos, com foco em cadastro de pacientes, agenda, sessões, confirmações e organização dos atendimentos.

O projeto foi criado como parte do meu portfólio em desenvolvimento backend, aplicando conceitos de arquitetura em camadas, banco de dados relacional, validação de dados, documentação de API e testes automatizados.

---

## Tecnologias utilizadas

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## Sobre o projeto

- CRUD de pacientes
- cadastro e login simples do psicólogo para acessar o painel de demonstração
- cadastro de horário recorrente do paciente
- cadastro da disponibilidade semanal do psicólogo
- cadastro de bloqueios de agenda
- geração automática de agendamentos futuros
- envio simulado de confirmação de sessão
- processamento das respostas `1`, `2` e `3`
- fluxo de remarcação com busca de horários disponíveis
- interface web de demonstração para apresentar a proposta do produto
- documentação com Swagger
- testes automatizados para regras principais da API

A aplicação permite gerenciar:

- Psicólogos
- Pacientes
- Agendamentos
- Sessões
- Confirmações
- Remarcações

A proposta é simular uma solução real para organização clínica, considerando regras comuns da rotina profissional, como acompanhamento de sessões, status de atendimento e controle de agenda.

---

## Funcionalidades

- Cadastro de psicólogos
- Cadastro de pacientes
- Criação de agendamentos
- Registro de sessões
- Controle de status dos atendimentos
- Confirmação de consultas
- Remarcação de horários
- Documentação da API com Swagger
- Testes automatizados com Jest
- Integração com banco de dados MySQL via Prisma ORM

---

## Arquitetura

- `Patient`: dados do paciente
- `RecurringSchedule`: regra semanal de atendimento
- `Appointment`: sessão concreta gerada pela recorrência
- `PsychologistAvailability`: disponibilidade semanal do psicólogo
- `AvailabilityBlock`: bloqueios pontuais da agenda
- `MessageInteraction`: histórico de mensagens e respostas
- `Psychologist`: acesso simples do psicólogo ao painel de demonstração

O projeto segue uma organização baseada em módulos, utilizando a estrutura do NestJS.

Principais camadas utilizadas:

- `Controller`: responsável por receber as requisições HTTP
- `Service`: responsável pelas regras de negócio
- `DTO`: responsável pela validação e transporte dos dados
- `Prisma`: responsável pela comunicação com o banco de dados
- `Module`: responsável pela organização das dependências

---

## Preview

<img width="1902" height="1031" alt="image" src="https://github.com/user-attachments/assets/450579c9-5181-4cad-af35-454ad4baa2f1" />

### Psicólogos

- `POST /psicologos/cadastrar`
- `POST /psicologos/entrar`

### Disponibilidade

## Estrutura do projeto

```bash
src/
├── agendamentos/
├── pacientes/
├── psicologos/
├── sessoes/
├── prisma/
├── app.module.ts
└── main.ts
```

---

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/KefilweLourenco/api-gestao-psicologos.git
cd api-gestao-psicologos
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`.

Exemplo:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/api_gestao_psicologos"
```

### 4. Executar as migrations do Prisma

```bash
npx prisma migrate dev
```

### 5. Rodar a aplicação

```bash
npm run start:dev
```

### 7. Acesse a documentação

```text
http://localhost:3000/docs
```

### 8. Acesse a interface de demonstração

```text
http://localhost:3000
```

A interface consome as rotas reais da API e foi criada para facilitar a apresentação da proposta do projeto.

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
http://localhost:3000
```
---

## Documentação da API

A documentação da API pode ser acessada pelo Swagger após iniciar o projeto:

```bash
http://localhost:3000/api
```

---

## Testes

Para executar os testes automatizados:

```bash
npm run test
```

---

## Status do projeto

Projeto em desenvolvimento e evolução contínua.

Funcionalidades futuras planejadas:

- Autenticação e autorização
- Perfil de usuário
- Controle financeiro dos atendimentos
- Relatórios clínicos e administrativos
- Melhorias nos testes automatizados
- Deploy da aplicação

---

## Aprendizados

Durante o desenvolvimento deste projeto, aprofundei meus conhecimentos em:

- Desenvolvimento backend com NestJS
- Organização de APIs REST
- Modelagem de banco de dados relacional
- Uso do Prisma ORM
- Validação de dados com DTOs
- Documentação com Swagger
- Testes automatizados com Jest
- Estruturação de projeto para portfólio

---

## Autor

Projeto desenvolvido por **Kefilwe Lourenço** como parte do meu portfólio de desenvolvimento fullstack JavaScript durante a formação pela **Generation Brasil**, com foco em backend, regras de negócio e soluções úteis para a área da saúde mental.

A aplicação foi idealizada, validada e evoluída por mim, com apoio de ferramentas de IA no processo de prototipação, revisão e refatoração.
