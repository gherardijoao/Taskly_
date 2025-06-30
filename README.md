# Taskly - Sistema de Gerenciamento de Tarefas

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

### Autenticação
- `POST /users` - Cadastro de usuário
- `POST /login` - Login de usuário

### Tarefas (requer autenticação)
- `POST /tarefas` - Criar tarefa
- `GET /tarefas` - Listar tarefas
- `GET /tarefas/:id` - Buscar tarefa por ID
- `PUT /tarefas/:id` - Atualizar tarefa
- `DELETE /tarefas/:id` - Excluir tarefa

### Usuários (requer autenticação)
- `GET /profile` - Obter perfil do usuário
- `PUT /profile` - Atualizar perfil
- `DELETE /profile` - Excluir conta

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
  - `controllers/` - Testes de endpoints da API
  - `services/` - Testes de lógica de negócio
  - `middlewares/` - Testes de middlewares de autenticação

#### Tecnologias de Teste
- **Jest** - Framework de testes unitários e de integração
- **Supertest** - Biblioteca para testes de endpoints HTTP
- **SQLite** - Banco de dados em memória para testes isolados
- **TypeORM** - Configuração específica para ambiente de teste

#### Cobertura de Testes
- **Cobertura Geral:** 38.51%
- **Controllers:** 33.33% (AuthController: 90%, TaskController: 27.27%, UserController: 32.25%)
- **Services:** 54.81% (AuthService: 100%, TaskService: 54.76%, UserService: 36.11%)
- **Middlewares:** 100% (authMiddleware: 100%)
- **Models:** 100% (Tarefa: 100%, Usuario: 100%)

#### Tipos de Testes Implementados
1. **Testes Unitários**
   - Validação de entrada de dados
   - Lógica de negócio dos services
   - Criptografia de senhas
   - Geração e validação de tokens JWT

2. **Testes de Integração**
   - Endpoints da API REST
   - Interação com banco de dados
   - Middlewares de autenticação
   - Fluxos completos de CRUD

3. **Testes de Validação**
   - Campos obrigatórios
   - Formato de dados
   - Regras de negócio
   - Tratamento de erros

#### Execução dos Testes
```bash
cd backend
npm test
```

**Comandos Adicionais:**
- `npm test -- --coverage` - Executar com relatório de cobertura
- `npm test -- --watch` - Modo watch para desenvolvimento
- `npm test -- --verbose` - Saída detalhada dos testes

#### Configuração de Teste
- **Banco de Dados:** SQLite em memória para isolamento
- **Variáveis de Ambiente:** Configuração específica para `NODE_ENV=test`
- **Timeout:** Configurado para operações de banco de dados
- **Cleanup:** Limpeza automática de dados entre testes

## Scripts e Comandos

### Backend
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Compilar TypeScript
npm start            # Executar em produção
npm test             # Executar testes
npm run typeorm      # Comandos do TypeORM
npm run update-db    # Atualizar banco de dados
```

### Frontend
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
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
- Branches de correção: `fix/nome-da-correção`
- Branches de release e hotfix conforme necessário

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## Autor

**João Gherardi**

## Licença

Este projeto está sob a licença MIT.
