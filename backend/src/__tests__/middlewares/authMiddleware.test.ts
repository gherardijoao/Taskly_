import { authMiddleware } from '../../middlewares/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mock do jwt
jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  
  beforeEach(() => {
    // Configurar o ambiente de teste
    process.env.JWT_SECRET = 'test-secret';
    
    // Resetar todos os mocks
    jest.clearAllMocks();
    
    // Criar mocks para o request, response e next
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockNext = jest.fn();
    
    mockRequest = {
      headers: {}
    };
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    } as any;
  });
  
  it('deve passar para o próximo middleware quando token é válido', () => {
    // Configurar o mock request com token
    mockRequest.headers = {
      authorization: 'Bearer valid-token'
    };
    
    // Configurar o mock do jwt.verify
    const mockDecodedToken = { userId: '123', email: 'teste@example.com' };
    (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);
    
    // Executar o middleware
    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Verificar se o jwt.verify foi chamado corretamente
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
    
    // Verificar se o token decodificado foi adicionado ao request
    expect((mockRequest as any).user).toEqual(mockDecodedToken);
    
    // Verificar se o next foi chamado
    expect(mockNext).toHaveBeenCalled();
    
    // Verificar que nenhum erro foi retornado
    expect(mockStatus).not.toHaveBeenCalled();
    expect(mockJson).not.toHaveBeenCalled();
  });
  
  it('deve retornar erro 401 quando token não é fornecido', () => {
    // Configurar o mock request sem token
    mockRequest.headers = {};
    
    // Executar o middleware
    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Verificar a resposta
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    
    // Verificar que o next não foi chamado
    expect(mockNext).not.toHaveBeenCalled();
  });
  
  it('deve retornar erro 401 quando token é inválido', () => {
    // Configurar o mock request com token
    mockRequest.headers = {
      authorization: 'Bearer invalid-token'
    };
    
    // Configurar o mock do jwt.verify para lançar erro
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Token inválido');
    });
    
    // Executar o middleware
    authMiddleware(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Verificar a resposta
    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Token inválido' });
    
    // Verificar que o next não foi chamado
    expect(mockNext).not.toHaveBeenCalled();
  });
}); 