# Taskly - Sistema de Gerenciamento de Tarefas

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</div>

Sistema completo para gerenciamento de tarefas com interface web moderna e API REST robusta.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Instalação e Configuração](#instalação-e-configuração)
- [Execução do Projeto](#execução-do-projeto)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [API e Endpoints](#api-e-endpoints)
- [Testes](#testes)
- [Scripts e Comandos](#scripts-e-comandos)
- [Segurança](#segurança)
- [Responsividade](#responsividade)
- [Convenções e Padrões](#convenções-e-padrões)
- [Contribuição](#contribuição)

## Sobre o Projeto

Taskly é uma aplicação full-stack que permite aos usuários gerenciar suas tarefas de forma eficiente e organizada. O sistema oferece uma interface intuitiva para criar, visualizar, editar e excluir tarefas, com recursos de filtros, categorização e acompanhamento de progresso.

## Funcionalidades

### Autenticação e Usuários
- Cadastro de usuários com validação de email único
- Login seguro com JWT (JSON Web Token)
- Perfil de usuário com dados editáveis
- Logout automático com expiração de token

### Gerenciamento de Tarefas
- Criar tarefas com nome, descrição e categoria
- Definir data de cumprimento para cada tarefa
- Marcar tarefas como pendentes ou concluídas
- Editar e excluir tarefas
- Visualizar detalhes completos de cada tarefa

### Interface e Usabilidade
- Dashboard responsivo com estatísticas em tempo real
- Filtros por status (pendente/concluída), categoria e data
- Busca por nome de tarefa
- Visualização de progresso geral
- Interface adaptada para dispositivos móveis
- Modais para adicionar e editar tarefas

### Organização e Produtividade
- Categorização automática de tarefas
- Contadores de tarefas por status
- Estatísticas de produtividade
- Ordenação por data de criação
- Filtros por período (hoje, todas, pendentes, concluídas)

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada
- **Express.js** - Framework web
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Criptografia de senhas
- **Swagger** - Documentação da API
- **Docker** - Containerização

### Frontend
- **React** - Biblioteca para interface de usuário
- **TypeScript** - Linguagem de programação tipada
- **Vite** - Build tool e dev server
- **React Router** - Roteamento da aplicação
- **Framer Motion** - Animações e transições
- **React Icons** - Ícones da interface
- **CSS Modules** - Estilização modular

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão
- **Docker Compose** - Orquestração de containers

## Arquitetura do Sistema

```
taskly/
├── backend/                 # API REST
│   ├── src/
│   │   ├── controllers/     # Controladores da API
│   │   ├── services/        # Lógica de negócio
│   │   ├── models/          # Entidades do banco
│   │   ├── routes/          # Definição de rotas
│   │   ├── middlewares/     # Middlewares (auth, etc.)
│   │   └── database/        # Configuração do banco
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
├── frontend/
│   └── taskly-frontend/     # Interface React
│       ├── src/
│       │   ├── components/  # Componentes reutilizáveis
│       │   ├── pages/       # Páginas da aplicação
│       │   ├── services/    # Serviços de API
│       │   └── types/       # Definições TypeScript
│       ├── package.json
│       └── README.md
└── README.md
```

## Instalação e Configuração

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ e npm
- Git

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd taskly
```

## Execução do Projeto

### Backend com Docker
```bash
cd backend
docker compose up --build
```
O backend estará disponível em: http://localhost:3000

### Frontend
```bash
cd frontend/taskly-frontend
npm install
npm run dev
```
O frontend estará disponível em: http://localhost:5173

## Configuração de Ambiente

### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=taskly
PORT=3000
JWT_SECRET=sua_chave_secreta
```

### Frontend (.env)
```bash
cd frontend/taskly-frontend
cp .env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:
```
VITE_API_URL=http://localhost:3000
```

**Nota:** Se o backend estiver rodando em uma porta diferente ou em um servidor remoto, ajuste a URL da API conforme necessário.

## API e Endpoints

A API do Taskly segue princípios RESTful e utiliza autenticação JWT para proteger os endpoints. Todos os endpoints protegidos requerem o header `Authorization: Bearer <token>`.

###  Autenticação

| Método | Endpoint     | Descrição                                | Corpo da Requisição                      | Resposta                                 |
|--------|--------------|------------------------------------------|------------------------------------------|------------------------------------------|
| POST   | /login       | Autentica usuário e retorna token JWT    | `{ "email": "...", "senha": "..." }`     | `{ "token": "...", "user": {...} }`      |

###  Tarefas

| Método | Endpoint                   | Descrição                              | Corpo da Requisição / Parâmetros         | Resposta                                 |
|--------|----------------------------|----------------------------------------|------------------------------------------|------------------------------------------|
| POST   | /tarefas                   | Cria uma nova tarefa                   | `{ "nome": "...", "descricao": "..." }` | Objeto tarefa criada                     |
| GET    | /tarefas                   | Lista todas as tarefas do usuário      | -                                        | Array de tarefas                         |
| GET    | /tarefas/{id}              | Busca uma tarefa por ID                | `id` na URL                              | Objeto tarefa                            |
| PUT    | /tarefas/{id}              | Atualiza uma tarefa                    | `id` na URL, dados no corpo              | Objeto tarefa atualizada                 |
| DELETE | /tarefas/{id}              | Deleta uma tarefa                      | `id` na URL                              | Status 204 (No Content)                  |
| GET    | /tarefas/categoria/{categoria} | Lista tarefas por categoria        | `categoria` na URL                       | Array de tarefas                         |
| GET    | /tarefas/hoje              | Lista tarefas criadas hoje             | -                                        | Array de tarefas                         |
| GET    | /tarefas/busca             | Busca tarefas por texto                | `?q=texto` na query string               | Array de tarefas                         |
| GET    | /tarefas/resumo            | Obtém resumo estatístico das tarefas   | -                                        | Objeto com estatísticas                  |

###  Usuários

| Método | Endpoint     | Descrição                               | Corpo da Requisição                      | Resposta                                 |
|--------|--------------|------------------------------------------|------------------------------------------|------------------------------------------|
| POST   | /users       | Cria um novo usuário                    | `{ "nome": "...", "email": "..." }`     | Objeto usuário criado (sem senha)        |
| GET    | /profile     | Retorna os dados do usuário logado      | -                                        | Objeto usuário (sem senha)               |
| PUT    | /profile     | Atualiza os dados do usuário logado     | `{ "nome": "...", "email": "..." }`     | Objeto usuário atualizado                |
| DELETE | /profile     | Exclui a conta do usuário logado        | -                                        | Status 204 (No Content)                  |

### Documentação da API
Acesse a documentação interativa Swagger em:
```
http://localhost:3000/api-docs
```

## Testes

### Backend

#### Estrutura de Testes
- **Localização:** `backend/src/__tests__/`
- **Organização:** Testes organizados por camada da aplicação
  - `controllers/` - Testes unitários dos controladores
  - `services/` - Testes de integração com banco de dados
  - `middlewares/` - Testes do middleware de autenticação

#### Tecnologias de Teste
- **Jest** - Framework de testes
- **SQLite** - Banco de dados em memória para testes isolados
- **TypeORM** - Configuração específica para ambiente de teste

#### Tipos de Testes Implementados

1. **Testes Unitários**
   - Controladores com mocks de Request, Response e serviços
   - Middleware de autenticação com mocks de JWT
   - Validação de entradas e respostas

2. **Testes de Integração**
   - Serviços com banco de dados SQLite em memória
   - Operações CRUD completas no banco de dados
   - Validação de regras de negócio e relacionamentos

#### Execução dos Testes
```bash
cd backend
npm test
```


## Segurança

- Autenticação JWT obrigatória em rotas protegidas
- Senhas criptografadas com bcrypt
- Validação e sanitização de dados
- Isolamento de dados por usuário
- Tokens com expiração automática

## Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## Convenções e Padrões

### Convenção de Commits
Este projeto utiliza a convenção de commits [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), facilitando o versionamento semântico e a automação de changelogs.

### Estruturação do Git
O fluxo de trabalho segue o modelo **gitflow**:
- Branch principal: `main`
- Branch de desenvolvimento: `develop`
- Branches de features: `feature/nome-da-feature`



## Autor

**João Gherardi**

