import { TarefaController } from '../../controllers/TaskController';
import { TarefaService } from '../../services/TaskService';
import { Request, Response } from 'express';

describe('TarefaController', () => {
  let tarefaController: TarefaController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSend: jest.Mock;
  
  beforeEach(() => {
    // Criar mocks para o request e response
    mockJson = jest.fn();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson, send: mockSend });
    
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { userId: 'mock-user-id' }
    } as any;
    
    mockResponse = {
      status: mockStatus,
      json: mockJson,
      send: mockSend
    } as any;
    
    // Criar instância do controller
    tarefaController = new TarefaController();
    
    // Mock do método do serviço diretamente
    (tarefaController as any).tarefaService = {
      createTarefa: jest.fn(),
      getTarefasByUser: jest.fn(),
      getTarefasByStatus: jest.fn(),
      getTarefaById: jest.fn(),
      updateTarefa: jest.fn(),
      deleteTarefa: jest.fn()
    };
  });
  
  describe('create', () => {
    it('deve criar uma tarefa com sucesso', async () => {
      // Configurar o mock request
      mockRequest.body = {
        nome: 'Tarefa de Teste',
        descricao: 'Descrição da tarefa',
        status: 'pendente'
      };
      
      // Configurar o mock do serviço
      const mockTarefa = {
        id: 'mock-tarefa-id',
        nome: 'Tarefa de Teste',
        descricao: 'Descrição da tarefa',
        status: 'pendente',
        idUsuario: 'mock-user-id',
        nomeUsuario: 'Usuário Teste',
        dataCriacao: new Date(),
        dataAtualizacao: new Date()
      };
      
      (tarefaController as any).tarefaService.createTarefa.mockResolvedValue(mockTarefa);
      
      // Executar o método
      await tarefaController.create(mockRequest as Request, mockResponse as Response);
      
      // Verificar se o serviço foi chamado corretamente
      expect((tarefaController as any).tarefaService.createTarefa).toHaveBeenCalledWith(
        'mock-user-id',
        {
          nome: mockRequest.body.nome,
          descricao: mockRequest.body.descricao,
          status: mockRequest.body.status
        }
      );
      
      // Verificar a resposta
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockTarefa);
    });
    
    it('deve retornar erro 400 quando nome não é fornecido', async () => {
      // Configurar o mock request sem nome
      mockRequest.body = {
        descricao: 'Descrição da tarefa',
        status: 'pendente'
      };
      
      // Executar o método
      await tarefaController.create(mockRequest as Request, mockResponse as Response);
      
      // Verificar a resposta
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('Nome da tarefa é obrigatório')
      }));
    });
  });
  
  describe('getAll', () => {
    it('deve retornar todas as tarefas do usuário', async () => {
      // Configurar o mock do serviço
      const mockTarefas = [
        {
          id: 'tarefa-1',
          nome: 'Tarefa 1',
          status: 'pendente',
          idUsuario: 'mock-user-id'
        },
        {
          id: 'tarefa-2',
          nome: 'Tarefa 2',
          status: 'concluída',
          idUsuario: 'mock-user-id'
        }
      ];
      
      (tarefaController as any).tarefaService.getTarefasByUser.mockResolvedValue(mockTarefas);
      
      // Executar o método
      await tarefaController.getAll(mockRequest as Request, mockResponse as Response);
      
      // Verificar se o serviço foi chamado corretamente
      expect((tarefaController as any).tarefaService.getTarefasByUser).toHaveBeenCalledWith('mock-user-id');
      
      // Verificar a resposta
      expect(mockJson).toHaveBeenCalledWith(mockTarefas);
    });
  });
  
  describe('delete', () => {
    it('deve deletar uma tarefa com sucesso', async () => {
      // Configurar o mock request
      mockRequest.params = { id: 'tarefa-id' };
      
      // Configurar o mock do serviço
      (tarefaController as any).tarefaService.deleteTarefa.mockResolvedValue(undefined);
      
      // Executar o método
      await tarefaController.delete(mockRequest as Request, mockResponse as Response);
      
      // Verificar se o serviço foi chamado corretamente
      expect((tarefaController as any).tarefaService.deleteTarefa).toHaveBeenCalledWith('tarefa-id', 'mock-user-id');
      
      // Verificar a resposta
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockSend).toHaveBeenCalled();
    });
  });
}); 