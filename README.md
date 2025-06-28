# Taskly - API de Gerenciamento de Tarefas

Uma API REST completa para gerenciamento de tarefas, desenvolvida com Node.js, TypeScript, TypeORM e PostgreSQL.

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

### Documentação
- Swagger/OpenAPI completo e interativo
- Diagrama ER detalhado
- Documentação de endpoints com exemplos

## Arquitetura

```
backend/
├── src/
│   ├── controllers/     # Controladores REST
│   ├── services/        # Lógica de negócio
│   ├── models/          # Entidades TypeORM
│   ├── routes/          # Definição de rotas
│   ├── middlewares/     # Middlewares (auth, etc.)
│   ├── database/        # Configuração do banco
│   └── swagger.ts       # Configuração Swagger
├── docs/                # Documentação
├── docker-compose.yml   # Orquestração Docker
└── Dockerfile          # Container da aplicação
```

## Como Executar

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd taskly
```

### 2. Configure as variáveis de ambiente
```bash
cd backend
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 3. Execute com Docker
```bash
docker compose up --build
```

### 4. Acesse a aplicação
- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health

## Endpoints da API

### Autenticação
```
POST /login          # Login do usuário
POST /users          # Registro de usuário
```

### Tarefas (Requer autenticação JWT)
```
POST   /tarefas              # Criar tarefa
GET    /tarefas              # Listar tarefas (com filtro opcional)
GET    /tarefas/:id          # Buscar tarefa por ID
PUT    /tarefas/:id          # Atualizar tarefa
DELETE /tarefas/:id          # Deletar tarefa
```

## Modelo de Dados

### Tabela `usuarios`
- `id` (UUID, PK) - Identificador único
- `email` (VARCHAR, único) - Email do usuário
- `nome` (VARCHAR) - Nome completo
- `senha` (VARCHAR) - Senha criptografada
- `data_criacao` (TIMESTAMP) - Data de criação
- `data_atualizacao` (TIMESTAMP) - Data de atualização

### Tabela `tarefas`
- `id` (UUID, PK) - Identificador único
- `id_usuario` (UUID, FK) - Referência ao usuário
- `nome_usuario` (VARCHAR) - Nome do usuário (para facilitar visualização)
- `nome` (VARCHAR) - Título da tarefa
- `descricao` (TEXT, opcional) - Descrição detalhada
- `status` (VARCHAR) - Status: "pendente" ou "concluída"
- `data_criacao` (TIMESTAMP) - Data de criação
- `data_atualizacao` (TIMESTAMP) - Data de atualização

## Tecnologias Utilizadas

- **Framework Web:** Express.js 5.1.0
- **Linguagem:** Node.js, TypeScript
- **ORM:** TypeORM
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT (jsonwebtoken)
- **Criptografia:** bcryptjs
- **Documentação:** Swagger/OpenAPI
- **Containerização:** Docker, Docker Compose
- **Desenvolvimento:** ts-node-dev

## Como Usar

### 1. Criar um usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "minhasenha123"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "minhasenha123"
  }'
```

### 3. Criar uma tarefa (com token)
```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "nome": "Estudar TypeScript",
    "descricao": "Revisar decorators e interfaces",
    "status": "pendente"
  }'
```

### 4. Listar tarefas
```bash
curl -X GET http://localhost:3000/tarefas \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### 5. Filtrar por status
```bash
curl -X GET "http://localhost:3000/tarefas?status=pendente" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```


### Estrutura de branches
- `main` - Código estável
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções de bugs

## Segurança

- Autenticação JWT obrigatória em rotas sensíveis
- Senhas criptografadas com bcrypt
- Validação de entrada em todos os endpoints
- Isolamento de dados por usuário
- Sanitização de dados de entrada

## Status do Projeto

- Autenticação JWT implementada
- CRUD completo de tarefas
- Validações de negócio
- Documentação Swagger completa
- Docker configurado
- TypeScript configurado
- TypeORM com PostgreSQL
- Middleware de autenticação
- Filtros por status
- Campo nome_usuario para facilitar visualização

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Autor

**João Gherardi** 
