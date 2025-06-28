import { AuthController } from '../../controllers/AuthController';
import { AuthService } from '../../services/AuthService';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
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
    authController = new AuthController();
    
    // Mock do método do serviço diretamente
    (authController as any).authService = {
      authenticate: jest.fn()
    };
  });
  
  describe('login', () => {
    it('deve autenticar um usuário com sucesso', async () => {
      // Configurar o mock request
      mockRequest.body = {
        email: 'teste@example.com',
        senha: 'senha123'
      };
      
      // Configurar o mock do serviço
      const mockAuthResult = {
        user: {
          id: '123',
          nome: 'Usuário Teste',
          email: 'teste@example.com',
          dataCriacao: new Date(),
          dataAtualizacao: new Date()
        },
        token: 'jwt-token-mock'
      };
      
      (authController as any).authService.authenticate.mockResolvedValue(mockAuthResult);
      
      // Executar o método
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Verificar se o serviço foi chamado corretamente
      expect((authController as any).authService.authenticate).toHaveBeenCalledWith(
        mockRequest.body.email,
        mockRequest.body.senha
      );
      
      // Verificar a resposta
      expect(mockJson).toHaveBeenCalledWith(mockAuthResult);
    });
    
    it('deve retornar erro 400 quando email não é fornecido', async () => {
      // Configurar o mock request sem email
      mockRequest.body = {
        senha: 'senha123'
      };
      
      // Executar o método
      await authController.login(mockRequest as Request, mockResponse as Response);
      
      // Verificar a resposta
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Email e senha são obrigatórios')
      }));
    });
  });
}); 