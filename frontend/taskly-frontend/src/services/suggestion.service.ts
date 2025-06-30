import { httpService } from './http.service';

interface TaskSuggestion {
  dicas: string[];
  resumo: string;
}

interface SuggestionOptions {
  context?: string;
  categoria?: string;
  preferencias?: string;
}

class SuggestionService {
  private http = httpService;

  /**
   * Obter uma sugestão de tarefa da API
   */
  async getSuggestion(options: SuggestionOptions = {}): Promise<TaskSuggestion> {
    let queryParams = new URLSearchParams();
    
    if (options.context) {
      queryParams.append('context', options.context);
    }
    
    if (options.categoria) {
      queryParams.append('categoria', options.categoria);
    }
    
    if (options.preferencias) {
      queryParams.append('preferencias', options.preferencias);
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/tarefas/sugestao${queryString ? `?${queryString}` : ''}`;
    
    return this.http.get<TaskSuggestion>(endpoint);
  }
}

export default new SuggestionService(); 