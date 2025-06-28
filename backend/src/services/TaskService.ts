import { AppDataSource } from '../database/data-source';
import { Tarefa } from '../models/Tarefa';
import { Usuario } from '../models/Usuario';

export interface CreateTarefaDTO {
  nome: string;
  descricao?: string;
  status?: 'pendente' | 'concluída';
}

export interface UpdateTarefaDTO {
  nome?: string;
  descricao?: string;
  status?: 'pendente' | 'concluída';
}

export class TarefaService {
  private tarefaRepository = AppDataSource.getRepository(Tarefa);
  private usuarioRepository = AppDataSource.getRepository(Usuario);

  async createTarefa(userId: string, data: CreateTarefaDTO): Promise<Tarefa> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioRepository.findOneBy({ id: userId });
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Validações de negócio
    if (!data.nome || data.nome.trim().length === 0) {
      throw new Error('Nome da tarefa é obrigatório');
    }

    if (data.nome.length > 255) {
      throw new Error('Nome da tarefa não pode ter mais de 255 caracteres');
    }

    if (data.status && !['pendente', 'concluída'].includes(data.status)) {
      throw new Error('Status deve ser "pendente" ou "concluída"');
    }

    const tarefa = this.tarefaRepository.create({
      idUsuario: userId,
      nomeUsuario: usuario.nome,
      nome: data.nome.trim(),
      descricao: data.descricao?.trim() || undefined,
      status: data.status || 'pendente',
    });

    return await this.tarefaRepository.save(tarefa);
  }

  async getTarefasByUser(userId: string): Promise<Tarefa[]> {
    return this.tarefaRepository.find({
      where: { idUsuario: userId },
      order: { dataCriacao: 'DESC' },
    });
  }

  async getTarefaById(id: string, userId: string): Promise<Tarefa> {
    const tarefa = await this.tarefaRepository.findOne({
      where: { id, idUsuario: userId },
    });

    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }

    return tarefa;
  }

  async updateTarefa(id: string, userId: string, data: UpdateTarefaDTO): Promise<Tarefa> {
    const tarefa = await this.getTarefaById(id, userId);

    // Validações de negócio
    if (data.nome !== undefined) {
      if (!data.nome || data.nome.trim().length === 0) {
        throw new Error('Nome da tarefa é obrigatório');
      }
      if (data.nome.length > 255) {
        throw new Error('Nome da tarefa não pode ter mais de 255 caracteres');
      }
      tarefa.nome = data.nome.trim();
    }

    if (data.descricao !== undefined) {
      tarefa.descricao = data.descricao?.trim() || undefined;
    }

    if (data.status !== undefined) {
      if (!['pendente', 'concluída'].includes(data.status)) {
        throw new Error('Status deve ser "pendente" ou "concluída"');
      }
      tarefa.status = data.status;
    }

    // Atualizar nome do usuário caso ele tenha mudado
    const usuario = await this.usuarioRepository.findOneBy({ id: userId });
    if (usuario && usuario.nome !== tarefa.nomeUsuario) {
      tarefa.nomeUsuario = usuario.nome;
    }

    return await this.tarefaRepository.save(tarefa);
  }

  async deleteTarefa(id: string, userId: string): Promise<void> {
    const tarefa = await this.getTarefaById(id, userId);
    await this.tarefaRepository.remove(tarefa);
  }

  async getTarefasByStatus(userId: string, status: 'pendente' | 'concluída'): Promise<Tarefa[]> {
    return this.tarefaRepository.find({
      where: { idUsuario: userId, status },
      order: { dataCriacao: 'DESC' },
    });
  }
}