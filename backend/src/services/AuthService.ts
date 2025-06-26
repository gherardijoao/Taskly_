import { AppDataSource } from '../database/data-source';
import { Usuario } from '../models/Usuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  private userRepository = AppDataSource.getRepository(Usuario);

  async authenticate(email: string, senha: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new Error('Usuário ou senha inválidos');

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) throw new Error('Usuário ou senha inválidos');

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Não retornar senha!
    const { senha: _, ...userSafe } = user;
    return { user: userSafe, token };
  }
} 