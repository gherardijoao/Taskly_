import { Request, Response } from 'express';
import { SuggestionService } from '../services/SuggestionService';

export class SuggestionController {
  private suggestionService: SuggestionService;

  constructor() {
    this.suggestionService = new SuggestionService();
  }

  async sugerirTarefa(req: Request, res: Response): Promise<void> {
    try {
      const { context, categoria, preferencias } = req.query;
      
      const suggestion = await this.suggestionService.generateTaskSuggestion({
        context: context as string,
        categoria: categoria as string,
        preferencias: preferencias as string
      });
      
      res.json(suggestion);
    } catch (err: any) {
      res.status(500).json({ error: 'Erro ao gerar sugestão de tarefa', detalhes: err.message });
    }
  }
} 