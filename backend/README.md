# Taskly - Backend

## Sumário
- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Rodando o Backend](#rodando-o-backend)
- [Uso com Docker](#uso-com-docker)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Documentação Swagger](#documentação-swagger)
- [Endpoints Principais](#endpoints-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Segurança](#segurança)

---

## Descrição

API REST para gerenciamento de tarefas com autenticação JWT, construída em Node.js, TypeScript, Express, TypeORM e PostgreSQL.

---

## Funcionalidades

- Cadastro e login de usuários com senha criptografada (bcrypt)
- Autenticação JWT
- CRUD completo de tarefas (criar, listar, buscar, atualizar, deletar)
- Filtros por status e categoria
- Isolamento de dados por usuário
- Documentação automática via Swagger
- Pronto para rodar localmente ou via Docker

---

## Pré-requisitos

- Node.js (v18+ recomendado)
- npm
- Docker e Docker Compose (opcional, mas recomendado)
- PostgreSQL (caso não use Docker)

---

## Configuração do Ambiente

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repo>
   cd taskly/backend
   ```

2. **Crie um arquivo `.env` na raiz do backend:**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=taskly
   PORT=3000
   JWT_SECRET=sua_chave_secreta
   ```

---

## Rodando o Backend

### Usando Docker (recomendado)

1. **Suba o ambiente:**
   ```bash
   docker compose up --build
   ```
   Isso irá subir o backend e o banco PostgreSQL juntos.

2. **Acesse a API:**
   ```
   http://localhost:3000
   ```


## Uso com Docker

- O backend e o banco PostgreSQL sobem juntos via `docker-compose.yml`
- O banco é persistido em volume Docker
- O backend aplica scripts de atualização automática ao iniciar



## Variáveis de Ambiente

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`: Configurações do PostgreSQL
- `PORT`: Porta do backend (padrão: 3000)
- `JWT_SECRET`: Chave secreta para tokens JWT

---

## Documentação Swagger

Acesse a documentação interativa dos endpoints em:
```
http://localhost:3000/api-docs
```

---

## Endpoints Principais

### Cadastro de Usuário
- **POST** `/users`
- **Body:**
  ```json
  {
    "nome": "Seu Nome",
    "email": "seu@email.com",
    "senha": "suaSenha"
  }
  ```

### Login
- **POST** `/login`
- **Body:**
  ```json
  {
    "email": "seu@email.com",
    "senha": "suaSenha"
  }
  ```

### Tarefas (requer autenticação JWT)
- **POST** `/tarefas` — Criar tarefa
- **GET** `/tarefas` — Listar tarefas
- **GET** `/tarefas/:id` — Buscar tarefa por ID
- **PUT** `/tarefas/:id` — Atualizar tarefa
- **DELETE** `/tarefas/:id` — Deletar tarefa

**Todas as rotas de tarefas exigem o header:**
```
Authorization: Bearer <seu_token_jwt>
```

---

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── database/
│   └── swagger.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

## Segurança

- Autenticação JWT obrigatória em rotas protegidas
- Senhas criptografadas com bcrypt
- Validação e sanitização de dados
- Isolamento de dados por usuário

---

## Dúvidas?

Consulte a documentação Swagger ou abra uma issue. 