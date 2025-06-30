import { AppDataSource } from '../database/data-source';
import { Tarefa } from '../models/Tarefa';
import { Usuario } from '../models/Usuario';
import { Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

export interface CreateTarefaDTO {
  nome: string;
  descricao?: string;
  status?: 'pendente' | 'concluída';
  categoria?: string;
  dataCumprimento?: Date;
}

export interface UpdateTarefaDTO {
  nome?: string;
  descricao?: string;
  status?: 'pendente' | 'concluída';
  categoria?: string;
  dataCumprimento?: Date;
}

export interface TarefaFiltroDTO {
  status?: 'pendente' | 'concluída';
  categoria?: string;
  textoBusca?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface ResumoTarefasDTO {
  total: number;
  concluidas: number;
  pendentes: number;
  porCategoria: {
    [categoria: string]: number;
  };
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

    // Se o status for concluída e não tiver data de cumprimento, define a data atual
    if (data.status === 'concluída' && !data.dataCumprimento) {
      data.dataCumprimento = new Date();
    }

    const tarefa = this.tarefaRepository.create({
      idUsuario: userId,
      nomeUsuario: usuario.nome,
      nome: data.nome.trim(),
      descricao: data.descricao?.trim() || undefined,
      status: data.status || 'pendente',
      categoria: data.categoria?.trim() || undefined,
      dataCumprimento: data.dataCumprimento,
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
      
      // Se o status mudou para concluída e não tem data de cumprimento, define a data atual
      if (data.status === 'concluída' && tarefa.status !== 'concluída' && !data.dataCumprimento) {
        tarefa.dataCumprimento = new Date();
      } else if (data.status === 'pendente' && tarefa.status === 'concluída') {
        // Se voltou para pendente, remove a data de cumprimento
        tarefa.dataCumprimento = undefined;
      }
      
      tarefa.status = data.status;
    }
    
    if (data.categoria !== undefined) {
      tarefa.categoria = data.categoria?.trim() || undefined;
    }
    
    if (data.dataCumprimento !== undefined) {
      tarefa.dataCumprimento = data.dataCumprimento;
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
  
  async getTarefasByCategoria(userId: string, categoria: string): Promise<Tarefa[]> {
    return this.tarefaRepository.find({
      where: { idUsuario: userId, categoria },
      order: { dataCriacao: 'DESC' },
    });
  }
  
  async buscarTarefas(userId: string, filtro: TarefaFiltroDTO): Promise<Tarefa[]> {
    const where: any = { idUsuario: userId };
    
    if (filtro.status) {
      where.status = filtro.status;
    }
    
    if (filtro.categoria) {
      where.categoria = filtro.categoria;
    }
    
    if (filtro.textoBusca) {
      where.nome = Like(`%${filtro.textoBusca}%`);
    }
    
    if (filtro.dataInicio && filtro.dataFim) {
      where.dataCriacao = Between(filtro.dataInicio, filtro.dataFim);
    } else if (filtro.dataInicio) {
      where.dataCriacao = MoreThanOrEqual(filtro.dataInicio);
    } else if (filtro.dataFim) {
      where.dataCriacao = LessThanOrEqual(filtro.dataFim);
    }
    
    return this.tarefaRepository.find({
      where,
      order: { dataCriacao: 'DESC' },
    });
  }
  
  async getTarefasHoje(userId: string): Promise<Tarefa[]> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    return this.tarefaRepository.find({
      where: {
        idUsuario: userId,
        dataCriacao: Between(hoje, amanha)
      },
      order: { dataCriacao: 'DESC' },
    });
  }
  
  async getResumoTarefas(userId: string): Promise<ResumoTarefasDTO> {
    const tarefas = await this.getTarefasByUser(userId);
    
    const resumo: ResumoTarefasDTO = {
      total: tarefas.length,
      concluidas: 0,
      pendentes: 0,
      porCategoria: {}
    };
    
    tarefas.forEach(tarefa => {
      // Contagem por status
      if (tarefa.status === 'concluída') {
        resumo.concluidas++;
      } else {
        resumo.pendentes++;
      }
      
      // Contagem por categoria
      const categoria = tarefa.categoria || 'Sem categoria';
      if (!resumo.porCategoria[categoria]) {
        resumo.porCategoria[categoria] = 0;
      }
      resumo.porCategoria[categoria]++;
    });
    
    return resumo;
  }
}