import { httpService } from './http.service';
import type { 
  Task, 
  TaskSummary, 
  TaskFilters, 
  CreateTaskDTO, 
  UpdateTaskDTO 
} from '../types/task.types';

class TaskService {
  async getAllTasks(): Promise<Task[]> {
    return httpService.get<Task[]>('/tarefas');
  }

  async getTaskById(id: string): Promise<Task> {
    return httpService.get<Task>(`/tarefas/${id}`);
  }

  async getTodayTasks(): Promise<Task[]> {
    return httpService.get<Task[]>('/tarefas/hoje');
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    return httpService.get<Task[]>(`/tarefas/categoria/${category}`);
  }

  async searchTasks(searchTerm: string): Promise<Task[]> {
    return httpService.get<Task[]>('/tarefas/busca', { busca: searchTerm });
  }

  async getTaskSummary(): Promise<TaskSummary> {
    return httpService.get<TaskSummary>('/tarefas/resumo');
  }

  async filterTasks(filters: TaskFilters): Promise<Task[]> {
    return httpService.get<Task[]>('/tarefas', filters as Record<string, string>);
  }

  async createTask(task: CreateTaskDTO): Promise<Task> {
    return httpService.post<Task>('/tarefas', task);
  }

  async updateTask(id: string, task: UpdateTaskDTO): Promise<Task> {
    return httpService.put<Task>(`/tarefas/${id}`, task);
  }

  async deleteTask(id: string): Promise<void> {
    return httpService.delete(`/tarefas/${id}`);
  }

  async toggleTaskStatus(task: Task): Promise<Task> {
    const newStatus = task.status === 'pendente' ? 'concluída' : 'pendente';
    return this.updateTask(task.id, { status: newStatus });
  }
}

export const taskService = new TaskService(); 