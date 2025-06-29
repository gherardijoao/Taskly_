export interface Task {
  id: string;
  nome: string;
  descricao?: string;
  status: 'pendente' | 'concluída';
  categoria?: string;
  dataCriacao: string;
  dataCumprimento?: string;
  dataAtualizacao: string;
}

export interface TaskSummary {
  total: number;
  concluidas: number;
  pendentes: number;
  porCategoria: {
    [categoria: string]: number;
  };
}

export interface TaskFilters {
  status?: 'pendente' | 'concluída';
  categoria?: string;
  busca?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface CreateTaskDTO {
  nome: string;
  descricao?: string;
  status?: 'pendente' | 'concluída';
  categoria?: string;
  dataCumprimento?: string;
}

export interface UpdateTaskDTO {
  nome?: string;
  descricao?: string;
  status?: 'pendente' | 'concluída';
  categoria?: string;
  dataCumprimento?: string;
} 