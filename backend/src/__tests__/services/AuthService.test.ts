import { AuthService } from '../../services/AuthService';
import { UserService, CreateUserDTO } from '../../services/UserService';
import { initializeTestDataSource, closeTestDataSource, clearDatabase, TestDataSource } from '../../database/data-source.test';
import { Usuario } from '../../models/Usuario';
import bcrypt from 'bcryptjs';
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
    let userService: UserService;
    let authService: AuthService;

    beforeEach(async () => {
      userService = new UserService();
      authService = new AuthService();
      
      // Substituir os repositórios pelos de teste
      (userService as any).userRepository = TestDataSource.getRepository(Usuario);
      (authService as any).userRepository = TestDataSource.getRepository(Usuario);
    });

    it('deve autenticar usuário com credenciais válidas', async () => {
      const nome = 'Teste';
      const email = 'teste@example.com';
      const senha = 'senha123';

      const userData: CreateUserDTO = { nome, email, senha };
      await userService.createUser(userData);

      const result = await authService.authenticate(email, senha);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.nome).toBe(nome);
      expect(result.token).toBeDefined();
      expect(result.user).not.toHaveProperty('senha'); // Senha não deve ser retornada
    });

    it('deve lançar erro para usuário inexistente', async () => {
      await expect(authService.authenticate('inexistente@example.com', 'senha123')).rejects.toThrow('Usuário ou senha inválidos');
    });

    it('deve lançar erro para senha incorreta', async () => {
      const nome = 'Teste';
      const email = 'teste@example.com';
      const senha = 'senha123';

      const userData: CreateUserDTO = { nome, email, senha };
      await userService.createUser(userData);

      await expect(authService.authenticate(email, 'senhaerrada')).rejects.toThrow('Usuário ou senha inválidos');
    });
  });
}); 