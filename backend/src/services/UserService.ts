import { AppDataSource } from '../database/data-source';
import { Usuario } from '../models/Usuario';
import { Tarefa } from '../models/Tarefa';
import bcrypt from 'bcryptjs';

export interface CreateUserDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface UpdateUserDTO {
  nome?: string;
  email?: string;
  senha?: string;
}

export class UserService {
  private userRepository = AppDataSource.getRepository(Usuario);
  private taskRepository = AppDataSource.getRepository(Tarefa);

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(senha: string): boolean {
    // Mínimo 6 caracteres, pelo menos uma letra e um número
    return senha.length >= 6 && /[a-zA-Z]/.test(senha) && /\d/.test(senha);
  }

  private validateName(nome: string): boolean {
    // Nome deve ter pelo menos 2 caracteres e não pode conter apenas espaços
    return nome.trim().length >= 2;
  }

  async createUser(data: CreateUserDTO): Promise<Usuario> {
    // Normalizar dados primeiro
    const nomeNormalizado = data.nome.trim();
    const emailNormalizado = data.email.toLowerCase().trim();

    // Validações
    if (!this.validateName(nomeNormalizado)) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    if (!this.validateEmail(emailNormalizado)) {
      throw new Error('E-mail inválido');
    }

    if (!this.validatePassword(data.senha)) {
      throw new Error('Senha deve ter pelo menos 6 caracteres, uma letra e um número');
    }

    const existing = await this.userRepository.findOneBy({ email: emailNormalizado });
    if (existing) {
      throw new Error('E-mail já cadastrado');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);
    const user = this.userRepository.create({ 
      nome: nomeNormalizado, 
      email: emailNormalizado, 
      senha: senhaHash 
    });
    return this.userRepository.save(user);
  }

  async updateUser(userId: string, data: UpdateUserDTO): Promise<Usuario> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Validações para campos fornecidos
    if (data.nome !== undefined) {
      if (!this.validateName(data.nome)) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
      }
      user.nome = data.nome.trim();
    }

    if (data.email !== undefined) {
      if (!this.validateEmail(data.email)) {
        throw new Error('E-mail inválido');
      }
      
      const emailNormalizado = data.email.toLowerCase().trim();
      if (emailNormalizado !== user.email) {
        const existingEmail = await this.userRepository.findOneBy({ email: emailNormalizado });
        if (existingEmail) {
          throw new Error('E-mail já está em uso por outro usuário');
        }
        user.email = emailNormalizado;
      }
    }

    if (data.senha !== undefined) {
      if (!this.validatePassword(data.senha)) {
        throw new Error('Senha deve ter pelo menos 6 caracteres, uma letra e um número');
      }
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