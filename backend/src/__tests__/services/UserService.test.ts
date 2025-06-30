import { UserService, CreateUserDTO, UpdateUserDTO } from '../../services/UserService';
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
      const userData: CreateUserDTO = {
        nome: 'Teste',
        email: 'teste@example.com',
        senha: 'senha123'
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.nome).toBe(userData.nome);
      expect(user.email).toBe(userData.email.toLowerCase());
      
      // Verificar se a senha foi hasheada
      const senhaValida = await bcrypt.compare(userData.senha, user.senha);
      expect(senhaValida).toBe(true);
    });

    it('deve lançar erro quando email já existe', async () => {
      const userData: CreateUserDTO = {
        nome: 'Teste',
        email: 'teste@example.com',
        senha: 'senha123'
      };

      await userService.createUser(userData);

      await expect(userService.createUser(userData)).rejects.toThrow('E-mail já cadastrado');
    });

    it('deve lançar erro para email inválido', async () => {
      const userData: CreateUserDTO = {
        nome: 'Teste',
        email: 'email-invalido',
        senha: 'senha123'
      };

      await expect(userService.createUser(userData)).rejects.toThrow('E-mail inválido');
    });

    it('deve lançar erro para nome muito curto', async () => {
      const userData: CreateUserDTO = {
        nome: 'A',
        email: 'teste@example.com',
        senha: 'senha123'
      };

      await expect(userService.createUser(userData)).rejects.toThrow('Nome deve ter pelo menos 2 caracteres');
    });

    it('deve lançar erro para senha fraca', async () => {
      const userData: CreateUserDTO = {
        nome: 'Teste',
        email: 'teste@example.com',
        senha: '123'
      };

      await expect(userService.createUser(userData)).rejects.toThrow('Senha deve ter pelo menos 6 caracteres, uma letra e um número');
    });

    it('deve normalizar email para lowercase', async () => {
      const userData: CreateUserDTO = {
        nome: 'Teste',
        email: 'TESTE@EXAMPLE.COM',
        senha: 'senha123'
      };

      const user = await userService.createUser(userData);
      expect(user.email).toBe('teste@example.com');
    });

    it('deve trimar espaços do nome e email', async () => {
      const userData: CreateUserDTO = {
        nome: '  Teste  ',
        email: '  teste@example.com  ',
        senha: 'senha123'
      };

      const user = await userService.createUser(userData);
      expect(user.nome).toBe('Teste');
      expect(user.email).toBe('teste@example.com');
    });
  });

  describe('updateUser', () => {
    let existingUser: Usuario;

    beforeEach(async () => {
      const userData: CreateUserDTO = {
        nome: 'Usuário Original',
        email: 'original@example.com',
        senha: 'senha123'
      };
      existingUser = await userService.createUser(userData);
    });

    it('deve atualizar nome com sucesso', async () => {
      const updateData: UpdateUserDTO = { nome: 'Novo Nome' };
      const updatedUser = await userService.updateUser(existingUser.id, updateData);

      expect(updatedUser.nome).toBe('Novo Nome');
      expect(updatedUser.email).toBe(existingUser.email);
    });

    it('deve atualizar email com sucesso', async () => {
      const updateData: UpdateUserDTO = { email: 'novo@example.com' };
      const updatedUser = await userService.updateUser(existingUser.id, updateData);

      expect(updatedUser.email).toBe('novo@example.com');
      expect(updatedUser.nome).toBe(existingUser.nome);
    });

    it('deve lançar erro para email inválido na atualização', async () => {
      const updateData: UpdateUserDTO = { email: 'email-invalido' };
      
      await expect(userService.updateUser(existingUser.id, updateData)).rejects.toThrow('E-mail inválido');
    });

    it('deve lançar erro para email já em uso', async () => {
      // Criar outro usuário
      const outroUserData: CreateUserDTO = {
        nome: 'Outro Usuário',
        email: 'outro@example.com',
        senha: 'senha123'
      };
      await userService.createUser(outroUserData);

      // Tentar atualizar com email do outro usuário
      const updateData: UpdateUserDTO = { email: 'outro@example.com' };
      
      await expect(userService.updateUser(existingUser.id, updateData)).rejects.toThrow('E-mail já está em uso por outro usuário');
    });
  });
}); 