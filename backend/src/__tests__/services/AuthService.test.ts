import { AuthService } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { initializeTestDataSource, closeTestDataSource, clearDatabase, TestDataSource } from '../../database/data-source.test';
import { Usuario } from '../../models/Usuario';
import jwt from 'jsonwebtoken';

// Mock do process.env.JWT_SECRET
process.env.JWT_SECRET = 'test-secret-key';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  
  beforeAll(async () => {
    await initializeTestDataSource();
    authService = new AuthService();
    userService = new UserService();
    
    // Substituir os repositórios pelos repositórios de teste
    (authService as any).userRepository = TestDataSource.getRepository(Usuario);
    (userService as any).userRepository = TestDataSource.getRepository(Usuario);
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('authenticate', () => {
    it('deve autenticar um usuário com sucesso e retornar token', async () => {
      // Criar um usuário para testar
      const nome = 'Teste Auth';
      const email = 'teste.auth@example.com';
      const senha = 'senha123';

      await userService.createUser(nome, email, senha);

      // Tentar autenticar
      const result = await authService.authenticate(email, senha);

      // Verificações
      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.nome).toBe(nome);
      
      // Verificar se a senha não está sendo retornada
      expect(result.user).not.toHaveProperty('senha');
      
      // Verificar se o token é válido
      const decoded = jwt.verify(result.token, process.env.JWT_SECRET as string) as any;
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBeDefined();
      expect(decoded.email).toBe(email);
    });

    it('deve lançar erro quando email não existe', async () => {
      await expect(authService.authenticate('nao.existe@example.com', 'senha123'))
        .rejects.toThrow('Usuário ou senha inválidos');
    });

    it('deve lançar erro quando senha está incorreta', async () => {
      // Criar um usuário para testar
      const nome = 'Teste Auth';
      const email = 'teste.auth@example.com';
      const senha = 'senha123';

      await userService.createUser(nome, email, senha);

      // Tentar autenticar com senha errada
      await expect(authService.authenticate(email, 'senha_errada'))
        .rejects.toThrow('Usuário ou senha inválidos');
    });
  });
}); 