import { AppDataSource } from '../database/data-source';
import { Usuario } from '../models/Usuario';
import { Tarefa } from '../models/Tarefa';
import bcrypt from 'bcryptjs';

export class UserService {
  private userRepository = AppDataSource.getRepository(Usuario);
  private taskRepository = AppDataSource.getRepository(Tarefa);

  async createUser(nome: string, email: string, senha: string): Promise<Usuario> {
    const existing = await this.userRepository.findOneBy({ email });
    if (existing) {
      throw new Error('E-mail já cadastrado');
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const user = this.userRepository.create({ nome, email, senha: senhaHash });
    return this.userRepository.save(user);
  }

  async updateUser(userId: string, data: { nome?: string; email?: string; senha?: string }): Promise<Usuario> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o email já está em uso por outro usuário
    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userRepository.findOneBy({ email: data.email });
      if (existingEmail) {
        throw new Error('E-mail já está em uso por outro usuário');
      }
    }

    // Atualizar os campos fornecidos
    if (data.nome) user.nome = data.nome;
    if (data.email) user.email = data.email;
    if (data.senha) {
      user.senha = await bcrypt.hash(data.senha, 10);
    }

    return this.userRepository.save(user);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // Primeiro, excluir todas as tarefas associadas ao usuário
    await this.taskRepository.delete({ idUsuario: userId });
    
    // Depois, excluir o usuário
    await this.userRepository.remove(user);
  }

  async getUserById(userId: string): Promise<Usuario> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }
} 