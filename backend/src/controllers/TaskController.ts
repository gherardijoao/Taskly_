import { Request, Response } from 'express';
import { TarefaService } from '../services/TaskService';

export class TarefaController {
  private tarefaService: TarefaService;

  constructor() {
    this.tarefaService = new TarefaService();
  }

  async create(req: Request, res: Response): Promise<void> {
    const { nome, descricao, status, categoria, dataCumprimento } = req.body;
    const userId = (req as any).user.userId;

    // Validação de entrada
    if (!nome) {
      res.status(400).json({ error: 'Nome da tarefa é obrigatório' });
      return;
    }

    try {
      const tarefa = await this.tarefaService.createTarefa(userId, {
        nome,
        descricao,
        status,
        categoria,
        dataCumprimento: dataCumprimento ? new Date(dataCumprimento) : undefined,
      });
      res.status(201).json(tarefa);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.userId;
    const { status, categoria, busca, dataInicio, dataFim } = req.query;

    try {
      // Se tiver parâmetros de filtro, usa a busca avançada
      if (busca || categoria || dataInicio || dataFim) {
        const filtro = {
          status: status as 'pendente' | 'concluída' | undefined,
          categoria: categoria as string | undefined,
          textoBusca: busca as string | undefined,
          dataInicio: dataInicio ? new Date(dataInicio as string) : undefined,
          dataFim: dataFim ? new Date(dataFim as string) : undefined,
        };
        
        const tarefas = await this.tarefaService.buscarTarefas(userId, filtro);
        res.json(tarefas);
        return;
      }
      
      // Caso contrário, usa os métodos específicos
      if (status && (status === 'pendente' || status === 'concluída')) {
        const tarefas = await this.tarefaService.getTarefasByStatus(userId, status as 'pendente' | 'concluída');
        res.json(tarefas);
        return;
      }
      
      // Busca todas as tarefas
      const tarefas = await this.tarefaService.getTarefasByUser(userId);
      res.json(tarefas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    if (!id) {
      res.status(400).json({ error: 'ID da tarefa é obrigatório' });
      return;
    }

    try {
      const tarefa = await this.tarefaService.getTarefaById(id, userId);
      res.json(tarefa);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nome, descricao, status, categoria, dataCumprimento } = req.body;
    const userId = (req as any).user.userId;

    if (!id) {
      res.status(400).json({ error: 'ID da tarefa é obrigatório' });
      return;
    }

    // Validar se pelo menos um campo foi enviado
    if (nome === undefined && descricao === undefined && status === undefined && 
        categoria === undefined && dataCumprimento === undefined) {
      res.status(400).json({ 
        error: 'Pelo menos um campo deve ser fornecido para atualização' 
      });
      return;
    }

    try {
      const tarefa = await this.tarefaService.updateTarefa(id, userId, {
        nome,
        descricao,
        status,
        categoria,
        dataCumprimento: dataCumprimento ? new Date(dataCumprimento) : undefined,
      });
      res.json(tarefa);
    } catch (err: any) {
      const statusCode = err.message === 'Tarefa não encontrada' ? 404 : 400;
      res.status(statusCode).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    if (!id) {
      res.status(400).json({ error: 'ID da tarefa é obrigatório' });
      return;
    }

    try {
      await this.tarefaService.deleteTarefa(id, userId);
      res.status(204).send();
    } catch (err: any) {
      const statusCode = err.message === 'Tarefa não encontrada' ? 404 : 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
  
  async getTarefasByCategoria(req: Request, res: Response): Promise<void> {
    const { categoria } = req.params;
    const userId = (req as any).user.userId;

    if (!categoria) {
      res.status(400).json({ error: 'Categoria é obrigatória' });
      return;
    }

    try {
      const tarefas = await this.tarefaService.getTarefasByCategoria(userId, categoria);
      res.json(tarefas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async getTarefasHoje(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.userId;

    try {
      const tarefas = await this.tarefaService.getTarefasHoje(userId);
      res.json(tarefas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async buscarTarefas(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.userId;
    const { busca } = req.query;

    if (!busca) {
      res.status(400).json({ error: 'Termo de busca é obrigatório' });
      return;
    }

    try {
      const tarefas = await this.tarefaService.buscarTarefas(userId, { 
        textoBusca: busca as string 
      });
      res.json(tarefas);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  
  async getResumoTarefas(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.userId;

    try {
      const resumo = await this.tarefaService.getResumoTarefas(userId);
      res.json(resumo);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}