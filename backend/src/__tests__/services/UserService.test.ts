import { UserService } from '../../services/UserService';
import { Usuario } from '../../models/Usuario';
import { initializeTestDataSource, closeTestDataSource, clearDatabase, TestDataSource } from '../../database/data-source.test';
import bcrypt from 'bcryptjs';

describe('UserService', () => {
  let userService: UserService;
  
  beforeAll(async () => {
    await initializeTestDataSource();
    userService = new UserService();
    // Substituir o repositório do UserService pelo repositório de teste
    (userService as any).userRepository = TestDataSource.getRepository(Usuario);
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('createUser', () => {
    it('deve criar um usuário com sucesso', async () => {
      const nome = 'Teste';
      const email = 'teste@example.com';
      const senha = 'senha123';

      const user = await userService.createUser(nome, email, senha);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.nome).toBe(nome);
      expect(user.email).toBe(email);
      
      // Verificar se a senha foi hasheada
      const senhaValida = await bcrypt.compare(senha, user.senha);
      expect(senhaValida).toBe(true);
    });

    it('deve lançar erro quando email já existe', async () => {
      const nome = 'Teste';
      const email = 'teste@example.com';
      const senha = 'senha123';

      await userService.createUser(nome, email, senha);

      await expect(userService.createUser(nome, email, senha)).rejects.toThrow('E-mail já cadastrado');
    });
  });
}); 