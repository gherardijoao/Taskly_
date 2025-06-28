import { UserController } from '../../controllers/UserController';
import { UserService } from '../../services/UserService';
import { Request, Response } from 'express';

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  
  beforeEach(() => {
    // Criar mocks para o request e response
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {
      body: {}
    };
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    } as any;
    
    // Criar instância do controller
    userController = new UserController();
    
    // Mock do método do serviço diretamente
    (userController as any).userService = {
      createUser: jest.fn()
    };
  });
  
  describe('create', () => {
    it('deve criar um usuário com sucesso', async () => {
      // Configurar o mock request
      mockRequest.body = {
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: 'senha123'
      };
      
      // Configurar o mock do serviço
      const mockUser = {
        id: '123',
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        senha: 'senha_hasheada'
      };
      
      (userController as any).userService.createUser.mockResolvedValue(mockUser);
      
      // Executar o método
      await userController.create(mockRequest as Request, mockResponse as Response);
      
      // Verificar se o serviço foi chamado corretamente
      expect((userController as any).userService.createUser).toHaveBeenCalledWith(
        mockRequest.body.nome,
        mockRequest.body.email,
        mockRequest.body.senha
      );
      
      // Verificar a resposta
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        id: mockUser.id,
        nome: mockUser.nome,
        email: mockUser.email
      }));
      
      // Verificar que a senha não foi retornada
      expect(mockJson).not.toHaveBeenCalledWith(expect.objectContaining({
        senha: expect.any(String)
      }));
    });
    
    it('deve retornar erro 400 quando dados estão incompletos', async () => {
      // Configurar o mock request com dados incompletos
      mockRequest.body = {
        nome: 'Usuário Teste',
        // email está faltando
        senha: 'senha123'
      };
      
      // Executar o método
      await userController.create(mockRequest as Request, mockResponse as Response);
      
      // Verificar a resposta
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.any(String)
      }));
    });
  });
}); 