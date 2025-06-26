# Taskly - API Backend

## Sumário
- [Descrição](#descrição)
- [Setup e Execução](#setup-e-execução)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Uso com Docker](#uso-com-docker)
- [Documentação Swagger](#documentação-swagger)
- [Endpoints](#endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)

## Descrição
API para cadastro e autenticação de usuários, construída com Node.js, TypeScript, Express e PostgreSQL.

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
```

### 3. Suba o ambiente com Docker Compose
```bash
docker compose up --build
```

A API estará disponível em `http://localhost:3000`.

## Variáveis de Ambiente
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`: Configurações do banco PostgreSQL
- `PORT`: Porta do backend

## Uso com Docker
- O serviço do backend e do banco sobem juntos via `docker-compose.yml`.
- O banco de dados é persistido em volume Docker.

## Documentação Swagger
Acesse a documentação interativa dos endpoints em:
```
http://localhost:3000/api-docs
```

## Endpoints

### Cadastro de Usuário
- **POST** `/users`
- **Body (JSON):**
```json
{
  "nome": "João da Silva",
  "email": "joao@email.com",
  "senha": "minhaSenhaSegura"
}
```
- **Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nome":"João da Silva", "email":"joao@email.com", "senha":"minhaSenhaSegura"}'
```
- **Resposta de sucesso:**
```json
{
  "id": "uuid-gerado",
  "email": "joao@email.com",
  "nome": "João da Silva",
  "dataCriacao": "2024-05-30T12:34:56.789Z",
  "dataAtualizacao": "2024-05-30T12:34:56.789Z"
}
```
- **Resposta de erro (exemplo):**
```json
{
  "error": "Nome, email e senha são obrigatórios."
}
{
  "error": "E-mail já cadastrado"
}
```

## Estrutura do Projeto
```
backend/
├── src/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── swagger.ts
├── types/
│   └── swagger-jsdoc.d.ts
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

---

Para dúvidas, consulte a documentação Swagger ou abra uma issue. 