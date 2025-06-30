import { TarefaService, CreateTarefaDTO, UpdateTarefaDTO } from '../../services/TaskService';
import { UserService, CreateUserDTO } from '../../services/UserService';
import { initializeTestDataSource, closeTestDataSource, clearDatabase, TestDataSource } from '../../database/data-source.test';
import { Tarefa } from '../../models/Tarefa';
import { Usuario } from '../../models/Usuario';

describe('TarefaService', () => {
  let tarefaService: TarefaService;
  let userService: UserService;
  let userId: string;
  
  beforeAll(async () => {
    await initializeTestDataSource();
    tarefaService = new TarefaService();
    userService = new UserService();
    
    // Substituir os repositórios pelos repositórios de teste
    (tarefaService as any).tarefaRepository = TestDataSource.getRepository(Tarefa);
    (tarefaService as any).usuarioRepository = TestDataSource.getRepository(Usuario);
    (userService as any).userRepository = TestDataSource.getRepository(Usuario);
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  beforeEach(async () => {
    await clearDatabase();
    
    // Criar um usuário para os testes
    const userService = new UserService();
    (userService as any).userRepository = TestDataSource.getRepository(Usuario);
    
    const userData: CreateUserDTO = {
      nome: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      senha: 'senha123'
    };
    const user = await userService.createUser(userData);
    userId = user.id;
  });

  describe('createTarefa', () => {
    it('deve criar uma tarefa com sucesso', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'Tarefa de Teste',
        descricao: 'Descrição da tarefa de teste',
        status: 'pendente'
      };

      const tarefa = await tarefaService.createTarefa(userId, tarefaData);

      expect(tarefa).toBeDefined();
      expect(tarefa.id).toBeDefined();
      expect(tarefa.nome).toBe(tarefaData.nome);
      expect(tarefa.descricao).toBe(tarefaData.descricao);
      expect(tarefa.status).toBe(tarefaData.status);
      expect(tarefa.idUsuario).toBe(userId);
    });

    it('deve criar uma tarefa sem descrição', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'Tarefa sem descrição'
      };

      const tarefa = await tarefaService.createTarefa(userId, tarefaData);

      expect(tarefa).toBeDefined();
      expect(tarefa.nome).toBe(tarefaData.nome);
      expect(tarefa.descricao).toBeNull(); // SQLite retorna null em vez de undefined
      expect(tarefa.status).toBe('pendente'); // Status padrão
    });

    it('deve lançar erro quando nome da tarefa é vazio', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: ''
      };

      await expect(tarefaService.createTarefa(userId, tarefaData))
        .rejects.toThrow('Nome da tarefa é obrigatório');
    });

    it('deve lançar erro quando nome da tarefa tem mais de 255 caracteres', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'a'.repeat(256)
      };

      await expect(tarefaService.createTarefa(userId, tarefaData))
        .rejects.toThrow('Nome da tarefa não pode ter mais de 255 caracteres');
    });

    it('deve lançar erro quando status é inválido', async () => {
      // Usando type assertion para forçar o tipo errado para testar a validação
      const tarefaData = {
        nome: 'Tarefa com status inválido',
        status: 'invalido'
      } as unknown as CreateTarefaDTO;

      await expect(tarefaService.createTarefa(userId, tarefaData))
        .rejects.toThrow('Status deve ser "pendente" ou "concluída"');
    });

    it('deve lançar erro quando usuário não existe', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'Tarefa de Teste'
      };

      await expect(tarefaService.createTarefa('id-inexistente', tarefaData))
        .rejects.toThrow('Usuário não encontrado');
    });

    it('deve criar tarefa com dados mínimos', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'Tarefa Teste'
      };

      const tarefa = await tarefaService.createTarefa(userId, tarefaData);

      expect(tarefa).toBeDefined();
      expect(tarefa.id).toBeDefined();
      expect(tarefa.nome).toBe('Tarefa Teste');
      expect(tarefa.status).toBe('pendente');
      expect(tarefa.idUsuario).toBe(userId);
    });

    it('deve criar tarefa com todos os dados', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'Tarefa Completa',
        descricao: 'Descrição da tarefa',
        status: 'pendente',
        categoria: 'Trabalho',
        dataCumprimento: new Date('2024-12-31')
      };

      const tarefa = await tarefaService.createTarefa(userId, tarefaData);

      expect(tarefa.nome).toBe('Tarefa Completa');
      expect(tarefa.descricao).toBe('Descrição da tarefa');
      expect(tarefa.status).toBe('pendente');
      expect(tarefa.categoria).toBe('Trabalho');
      expect(tarefa.dataCumprimento).toEqual(new Date('2024-12-31'));
    });

    it('deve criar tarefa concluída com data automática', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'Tarefa Concluída',
        status: 'concluída'
      };

      const tarefa = await tarefaService.createTarefa(userId, tarefaData);

      expect(tarefa.status).toBe('concluída');
      expect(tarefa.dataCumprimento).toBeDefined();
      expect(tarefa.dataCumprimento).toBeInstanceOf(Date);
    });

    it('deve lançar erro para nome vazio', async () => {
      const tarefaData = {
        nome: ''
      } as CreateTarefaDTO;

      await expect(tarefaService.createTarefa(userId, tarefaData)).rejects.toThrow('Nome da tarefa é obrigatório');
    });

    it('deve lançar erro para nome muito longo', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'a'.repeat(256)
      };

      await expect(tarefaService.createTarefa(userId, tarefaData)).rejects.toThrow('Nome da tarefa não pode ter mais de 255 caracteres');
    });

    it('deve lançar erro para status inválido', async () => {
      const tarefaData = {
        nome: 'Tarefa Teste',
        status: 'invalido'
      } as any;

      await expect(tarefaService.createTarefa(userId, tarefaData)).rejects.toThrow('Status deve ser "pendente" ou "concluída"');
    });
  });

  describe('getTarefasByUser', () => {
    it('deve retornar tarefas do usuário', async () => {
      // Criar algumas tarefas para o usuário
      const tarefa1 = await tarefaService.createTarefa(userId, { nome: 'Tarefa 1' });
      // Aguardar um momento para garantir que a segunda tarefa tenha timestamp diferente
      await new Promise(resolve => setTimeout(resolve, 100));
      const tarefa2 = await tarefaService.createTarefa(userId, { nome: 'Tarefa 2' });
      
      const tarefas = await tarefaService.getTarefasByUser(userId);
      
      expect(tarefas).toHaveLength(2);
      // Verificar apenas que ambas as tarefas foram retornadas, sem se importar com a ordem
      expect(tarefas.map(t => t.nome).sort()).toEqual(['Tarefa 1', 'Tarefa 2'].sort());
    });

    it('deve retornar array vazio quando usuário não tem tarefas', async () => {
      const tarefas = await tarefaService.getTarefasByUser(userId);
      expect(tarefas).toEqual([]);
    });
  });

  describe('getTarefaById', () => {
    it('deve retornar uma tarefa específica', async () => {
      const tarefa = await tarefaService.createTarefa(userId, { 
        nome: 'Tarefa Específica',
        descricao: 'Descrição da tarefa específica' 
      });
      
      const tarefaEncontrada = await tarefaService.getTarefaById(tarefa.id, userId);
      
      expect(tarefaEncontrada).toBeDefined();
      expect(tarefaEncontrada.id).toBe(tarefa.id);
      expect(tarefaEncontrada.nome).toBe(tarefa.nome);
    });

    it('deve lançar erro quando tarefa não existe', async () => {
      await expect(tarefaService.getTarefaById('id-inexistente', userId))
        .rejects.toThrow('Tarefa não encontrada');
    });

    it('deve lançar erro quando tarefa pertence a outro usuário', async () => {
      // Criar outro usuário
      const userService = new UserService();
      (userService as any).userRepository = TestDataSource.getRepository(Usuario);
      
      const outroUserData: CreateUserDTO = {
        nome: 'Outro Usuário',
        email: 'outro@example.com',
        senha: 'senha123'
      };
      const outroUser = await userService.createUser(outroUserData);
      
      // Criar tarefa para o outro usuário
      const tarefa = await tarefaService.createTarefa(outroUser.id, { nome: 'Tarefa do Outro' });
      
      // Tentar acessar a tarefa com o usuário original
      await expect(tarefaService.getTarefaById(tarefa.id, userId))
        .rejects.toThrow('Tarefa não encontrada');
    });
  });

  describe('updateTarefa', () => {
    it('deve atualizar uma tarefa com sucesso', async () => {
      // Criar uma tarefa
      const tarefa = await tarefaService.createTarefa(userId, { 
        nome: 'Tarefa Original',
        descricao: 'Descrição original' 
      });
      
      // Dados para atualização
      const updateData: UpdateTarefaDTO = {
        nome: 'Tarefa Atualizada',
        descricao: 'Descrição atualizada',
        status: 'concluída'
      };
      
      // Atualizar a tarefa
      const tarefaAtualizada = await tarefaService.updateTarefa(tarefa.id, userId, updateData);
      
      expect(tarefaAtualizada).toBeDefined();
      expect(tarefaAtualizada.id).toBe(tarefa.id);
      expect(tarefaAtualizada.nome).toBe(updateData.nome);
      expect(tarefaAtualizada.descricao).toBe(updateData.descricao);
      expect(tarefaAtualizada.status).toBe(updateData.status);
    });

    it('deve atualizar apenas o nome da tarefa', async () => {
      const tarefa = await tarefaService.createTarefa(userId, { 
        nome: 'Tarefa Original',
        descricao: 'Descrição original' 
      });
      
      const tarefaAtualizada = await tarefaService.updateTarefa(tarefa.id, userId, { 
        nome: 'Apenas Nome Atualizado' 
      });
      
      expect(tarefaAtualizada.nome).toBe('Apenas Nome Atualizado');
      expect(tarefaAtualizada.descricao).toBe(tarefa.descricao);
      expect(tarefaAtualizada.status).toBe(tarefa.status);
    });

    it('deve lançar erro ao atualizar com nome vazio', async () => {
      const tarefa = await tarefaService.createTarefa(userId, { nome: 'Tarefa Original' });
      
      await expect(tarefaService.updateTarefa(tarefa.id, userId, { nome: '' }))
        .rejects.toThrow('Nome da tarefa é obrigatório');
    });

    it('deve atualizar tarefa com sucesso', async () => {
      const tarefaData: CreateTarefaDTO = {
        nome: 'Tarefa Original'
      };
      const tarefa = await tarefaService.createTarefa(userId, tarefaData);

      const updateData: UpdateTarefaDTO = {
        nome: 'Tarefa Atualizada',
        descricao: 'Nova descrição',
        status: 'concluída'
      };

      const updatedTarefa = await tarefaService.updateTarefa(tarefa.id, userId, updateData);

      expect(updatedTarefa.nome).toBe('Tarefa Atualizada');
      expect(updatedTarefa.descricao).toBe('Nova descrição');
      expect(updatedTarefa.status).toBe('concluída');
      expect(updatedTarefa.dataCumprimento).toBeDefined();
    });
  });

  describe('deleteTarefa', () => {
    it('deve deletar uma tarefa com sucesso', async () => {
      // Criar uma tarefa
      const tarefa = await tarefaService.createTarefa(userId, { nome: 'Tarefa para Deletar' });
      
      // Deletar a tarefa
      await tarefaService.deleteTarefa(tarefa.id, userId);
      
      // Verificar se a tarefa foi deletada
      await expect(tarefaService.getTarefaById(tarefa.id, userId))
        .rejects.toThrow('Tarefa não encontrada');
    });

    it('deve lançar erro ao tentar deletar tarefa inexistente', async () => {
      await expect(tarefaService.deleteTarefa('id-inexistente', userId))
        .rejects.toThrow('Tarefa não encontrada');
    });
  });

  describe('getTarefasByStatus', () => {
    it('deve retornar apenas tarefas com status específico', async () => {
      // Criar tarefas com status diferentes
      await tarefaService.createTarefa(userId, { 
        nome: 'Tarefa Pendente 1',
        status: 'pendente'
      });
      
      await tarefaService.createTarefa(userId, { 
        nome: 'Tarefa Pendente 2',
        status: 'pendente'
      });
      
      await tarefaService.createTarefa(userId, { 
        nome: 'Tarefa Concluída',
        status: 'concluída'
      });
      
      // Buscar tarefas pendentes
      const tarefasPendentes = await tarefaService.getTarefasByStatus(userId, 'pendente');
      
      expect(tarefasPendentes).toHaveLength(2);
      expect(tarefasPendentes[0].status).toBe('pendente');
      expect(tarefasPendentes[1].status).toBe('pendente');
      
      // Buscar tarefas concluídas
      const tarefasConcluidas = await tarefaService.getTarefasByStatus(userId, 'concluída');
      
      expect(tarefasConcluidas).toHaveLength(1);
      expect(tarefasConcluidas[0].status).toBe('concluída');
    });

    it('deve retornar array vazio quando não há tarefas com o status', async () => {
      const tarefas = await tarefaService.getTarefasByStatus(userId, 'concluída');
      expect(tarefas).toEqual([]);
    });
  });

  describe('criarTarefaParaOutroUsuario', () => {
    it('deve criar tarefa para outro usuário', async () => {
      const userService = new UserService();
      (userService as any).userRepository = TestDataSource.getRepository(Usuario);
      
      const outroUserData: CreateUserDTO = {
        nome: 'Outro Usuário',
        email: 'outro@example.com',
        senha: 'senha123'
      };
      const outroUser = await userService.createUser(outroUserData);

      const tarefaData: CreateTarefaDTO = {
        nome: 'Tarefa do Outro Usuário'
      };
      const tarefa = await tarefaService.createTarefa(outroUser.id, tarefaData);

      expect(tarefa.idUsuario).toBe(outroUser.id);
      expect(tarefa.nomeUsuario).toBe('Outro Usuário');
    });
  });
}); 