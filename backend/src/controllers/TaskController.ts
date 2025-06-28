import { Request, Response } from 'express';
import { TarefaService } from '../services/TaskService';

const tarefaService = new TarefaService();

export class TarefaController {
  async create(req: Request, res: Response): Promise<void> {
    const { nome, descricao, status } = req.body;
    const userId = (req as any).user.userId;

    // Validação de entrada
    if (!nome) {
      res.status(400).json({ error: 'Nome da tarefa é obrigatório' });
      return;
    }

    try {
      const tarefa = await tarefaService.createTarefa(userId, {
        nome,
        descricao,
        status,
      });
      res.status(201).json(tarefa);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.userId;
    const { status } = req.query;

    try {
      let tarefas;
      if (status && (status === 'pendente' || status === 'concluída')) {
        tarefas = await tarefaService.getTarefasByStatus(userId, status as 'pendente' | 'concluída');
      } else {
        tarefas = await tarefaService.getTarefasByUser(userId);
      }
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
      const tarefa = await tarefaService.getTarefaById(id, userId);
      res.json(tarefa);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nome, descricao, status } = req.body;
    const userId = (req as any).user.userId;

    if (!id) {
      res.status(400).json({ error: 'ID da tarefa é obrigatório' });
      return;
    }

    // Validar se pelo menos um campo foi enviado
    if (nome === undefined && descricao === undefined && status === undefined) {
      res.status(400).json({ 
        error: 'Pelo menos um campo (nome, descricao ou status) deve ser fornecido' 
      });
      return;
    }

    try {
      const tarefa = await tarefaService.updateTarefa(id, userId, {
        nome,
        descricao,
        status,
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
      await tarefaService.deleteTarefa(id, userId);
      res.status(204).send();
    } catch (err: any) {
      const statusCode = err.message === 'Tarefa não encontrada' ? 404 : 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}