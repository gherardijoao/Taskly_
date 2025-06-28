# Taskly - API Backend

## Sumário
- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Setup e Execução](#setup-e-execução)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Uso com Docker](#uso-com-docker)
- [Documentação Swagger](#documentação-swagger)
- [Endpoints](#endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Segurança](#segurança)

## Descrição
API completa para gerenciamento de tarefas com autenticação de usuários, construída com Node.js, TypeScript, Express, TypeORM e PostgreSQL.

## Funcionalidades

### Autenticação e Usuários
- Registro de usuários com validação de email único
- Login com JWT (JSON Web Token)
- Autenticação obrigatória em todas as rotas de tarefas
- Isolamento por usuário - cada usuário só acessa suas próprias tarefas

### Gerenciamento de Tarefas (CRUD Completo)
- Criar tarefas com nome, descrição e status
- Listar tarefas do usuário autenticado
- Buscar tarefa por ID
- Atualizar tarefas (nome, descrição, status)
- Deletar tarefas
- Filtrar por status (pendente/concluída)
- Ordenação por data de criação (mais recentes primeiro)

### Segurança e Validações
- Senhas criptografadas com bcrypt
- Tokens JWT com expiração de 1 hora
- Validações de entrada robustas
- Sanitização de dados
- Middleware de autenticação em todas as rotas protegidas

## Setup e Execução

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o arquivo `.env`
Exemplo:
```
DB_HOST=postgres
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha_segura
DB_NAME=taskly
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt
```

### 3. Suba o ambiente com Docker Compose
```bash
docker compose up --build
```

A API estará disponível em `http://localhost:3000`.

## Variáveis de Ambiente
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`: Configurações do banco PostgreSQL
- `PORT`: Porta do backend
- `JWT_SECRET`: Chave secreta para assinatura dos tokens JWT

## Uso com Docker
- O serviço do backend e do banco sobem juntos via `docker-compose.yml`
- O banco de dados é persistido em volume Docker
- Script de migração automática para tarefas existentes

## Documentação Swagger
Acesse a documentação interativa dos endpoints em:
```
http://localhost:3000/api-docs
```

## Endpoints

### Autenticação

#### Cadastro de Usuário
- **POST** `/users`
- **Body (JSON):**
```json
{
  "nome": "João da Silva",
  "email": "joao@email.com",
  "senha": "minhaSenhaSegura"
}
```

#### Login
- **POST** `/login`
- **Body (JSON):**
```json
{
  "email": "joao@email.com",
  "senha": "minhaSenhaSegura"
}
```
- **Resposta de sucesso:**
```json
{
  "user": {
    "id": "uuid-gerado",
    "email": "joao@email.com",
    "nome": "João da Silva",
    "dataCriacao": "2024-05-30T12:34:56.789Z",
    "dataAtualizacao": "2024-05-30T12:34:56.789Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Tarefas (Requer autenticação JWT)

#### Criar Tarefa
- **POST** `/tarefas`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
```json
{
  "nome": "Estudar TypeScript",
  "descricao": "Revisar decorators e interfaces",
  "status": "pendente"
}
```

#### Listar Tarefas
- **GET** `/tarefas`
- **Headers:** `Authorization: Bearer <token>`
- **Query params (opcional):** `?status=pendente`

#### Buscar Tarefa por ID
- **GET** `/tarefas/:id`
- **Headers:** `Authorization: Bearer <token>`

#### Atualizar Tarefa
- **PUT** `/tarefas/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body (JSON):**
```json
{
  "nome": "Estudar TypeScript e React",
  "status": "concluída"
}
```

#### Deletar Tarefa
- **DELETE** `/tarefas/:id`
- **Headers:** `Authorization: Bearer <token>`

## Estrutura do Projeto
```
backend/
├── src/
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   └── TaskController.ts
│   ├── services/
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   └── TaskService.ts
│   ├── models/
│   │   ├── Usuario.ts
│   │   └── Tarefa.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── task.routes.ts
│   ├── middlewares/
│   │   └── authMiddleware.ts
│   ├── database/
│   │   ├── data-source.ts
│   │   └── update-existing-tasks.ts
│   └── swagger.ts
├── docs/
│   └── modelagemER.md
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Segurança

- Autenticação JWT obrigatória em rotas sensíveis
- Senhas criptografadas com bcrypt
- Validação de entrada em todos os endpoints
- Isolamento de dados por usuário
- Sanitização de dados de entrada
- Verificação de propriedade das tarefas

## Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Compilar TypeScript
npm run start        # Executar em produção
```

---

Para dúvidas, consulte a documentação Swagger ou abra uma issue. 