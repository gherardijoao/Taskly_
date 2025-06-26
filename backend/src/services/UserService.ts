import { AppDataSource } from '../database/data-source';
import { Usuario } from '../models/Usuario';
import bcrypt from 'bcryptjs';

export class UserService {
  private userRepository = AppDataSource.getRepository(Usuario);

  async createUser(nome: string, email: string, senha: string): Promise<Usuario> {
    const existing = await this.userRepository.findOneBy({ email });
    if (existing) {
      throw new Error('E-mail já cadastrado');
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const user = this.userRepository.create({ nome, email, senha: senhaHash });
    return this.userRepository.save(user);
  }
} 