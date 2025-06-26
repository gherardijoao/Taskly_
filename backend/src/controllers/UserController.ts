import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    try {
      const user = await userService.createUser(nome, email, senha);
      // Não retornar senha!
      const { senha: _, ...userSafe } = user;
      return res.status(201).json(userSafe);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
} 