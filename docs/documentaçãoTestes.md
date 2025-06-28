# Documentação Técnica de Testes - Taskly

## Visão Geral

Este documento detalha a implementação de testes unitários no projeto Taskly, uma API REST de gerenciamento de tarefas. A estratégia de testes utiliza Jest como framework principal, com ts-jest para suporte a TypeScript e SQLite em memória para simular o banco de dados.

## Configuração do Ambiente de Teste

### Dependências Principais

- **Jest**: Framework de testes
- **ts-jest**: Integração do Jest com TypeScript
- **supertest**: Biblioteca para testar requisições HTTP
- **SQLite**: Banco de dados em memória para testes

### Configuração Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/database/data-source.test.ts',
  ],
};
```

### Banco de Dados para Testes

Foi criado um arquivo `data-source.test.ts` que configura uma conexão SQLite em memória:

```typescript
// Configuração do TypeORM para ambiente de teste
export const AppDataSourceTest = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [/* entidades */],
  synchronize: true,
  logging: false
});
```

## Estrutura de Testes

Os testes seguem a estrutura de diretórios do código-fonte, organizados em:

```
src/
  __tests__/
    controllers/
    middlewares/
    services/
```

## Testes de Serviços

### UserService

```typescript
// UserService.test.ts
describe('UserService', () => {
  test('should create a user', async () => {
    // Arrange
    const userData = { /* dados do usuário */ };
    // Act
    const user = await userService.createUser(userData);
    // Assert
    expect(user).toHaveProperty('id');
  });
  
  // Outros testes...
});
```

### AuthService

```typescript
// AuthService.test.ts
describe('AuthService', () => {
  test('should authenticate valid user', async () => {
    // Arrange
    const credentials = { /* credenciais */ };
    // Act
    const result = await authService.login(credentials);
    // Assert
    expect(result).toHaveProperty('token');
  });
  
  // Testes para validação de senha, geração de token, etc.
});
```

### TaskService

```typescript
// TaskService.test.ts
describe('TaskService', () => {
  test('should create a task', async () => {
    // Arrange
    const taskData = { /* dados da tarefa */ };
    // Act
    const task = await taskService.createTask(taskData);
    // Assert
    expect(task).toHaveProperty('id');
  });
  
  // Testes para listar, atualizar, deletar tarefas, etc.
});
```

## Testes de Controladores

Os controladores foram testados utilizando supertest para simular requisições HTTP:

### UserController

```typescript
// UserController.test.ts
describe('UserController', () => {
  test('POST /users should create a user', async () => {
    // Arrange
    const userData = { /* dados do usuário */ };
    // Act
    const response = await request(app)
      .post('/users')
      .send(userData);
    // Assert
    expect(response.status).toBe(201);
  });
  
  // Outros testes de rotas...
});
```

### AuthController

```typescript
// AuthController.test.ts
describe('AuthController', () => {
  test('POST /auth/login should return token', async () => {
    // Arrange
    const credentials = { /* credenciais */ };
    // Act
    const response = await request(app)
      .post('/auth/login')
      .send(credentials);
    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
  
  // Testes para validação de credenciais, etc.
});
```

### TaskController

```typescript
// TaskController.test.ts
describe('TaskController', () => {
  test('GET /tasks should return tasks for authenticated user', async () => {
    // Arrange
    const token = /* token válido */;
    // Act
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);
    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  // Testes para CRUD de tarefas...
});
```

## Testes de Middlewares

### authMiddleware

```typescript
// authMiddleware.test.ts
describe('authMiddleware', () => {
  test('should allow access with valid token', async () => {
    // Arrange
    const token = /* token válido */;
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();
    
    // Act
    await authMiddleware(req, res, next);
    
    // Assert
    expect(next).toHaveBeenCalled();
    expect(req).toHaveProperty('user');
  });
  
  // Testes para tokens inválidos, ausência de token, etc.
});
```

## Injeção de Dependências

Para facilitar os testes, os controladores foram refatorados para usar injeção de dependências:

```typescript
// Exemplo de controlador com injeção de dependência
export class TaskController {
  constructor(private taskService: TaskService) {}
  
  async create(req: Request, res: Response) {
    // Implementação
  }
}
```

Nos testes, são injetados mocks dos serviços:

```typescript
// Mock do serviço
const mockTaskService = {
  createTask: jest.fn(),
  // outros métodos
};

// Instanciação do controlador com mock
const taskController = new TaskController(mockTaskService as unknown as TaskService);
```

## Cobertura de Testes

A cobertura final de código atingiu 64.28%, com destaque para:
- Serviços: 95.58%
- Controladores: 87.32%
- Middlewares: 91.67%

## Desafios e Soluções

### Incompatibilidade PostgreSQL/SQLite

Foram necessários ajustes nos tipos de dados das entidades para compatibilidade com SQLite:

```typescript
// Exemplo de ajuste
@Column({
  type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz',
  default: () => 'CURRENT_TIMESTAMP',
})
created_at: Date;
```

### Mocks e Injeção de Dependências

A refatoração para injeção de dependências permitiu:
- Testar controladores isoladamente
- Simular comportamentos específicos dos serviços
- Evitar chamadas reais ao banco de dados

## Conclusão

A implementação de testes unitários no Taskly seguiu as melhores práticas de desenvolvimento, com isolamento de componentes, mocks para dependências externas e banco de dados em memória para testes rápidos e confiáveis. 