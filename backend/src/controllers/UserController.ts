import { Request, Response } from 'express';
import { UserService, CreateUserDTO, UpdateUserDTO } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async create(req: Request, res: Response) {
    const { nome, email, senha } = req.body;
    
    // Validação básica de campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        error: 'Nome, email e senha são obrigatórios.' 
      });
    }

    try {
      const userData: CreateUserDTO = { nome, email, senha };
      const user = await this.userService.createUser(userData);
      
      // Não retornar senha!
      const { senha: _, ...userSafe } = user;
      return res.status(201).json(userSafe);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId; // Obtém o ID do usuário do token JWT
      const { nome, email, senha } = req.body;
      
      // Verifica se pelo menos um campo foi fornecido
      if (!nome && !email && !senha) {
        return res.status(400).json({ 
          error: 'Pelo menos um campo deve ser fornecido para atualização.' 
        });
      }
      
      const updateData: UpdateUserDTO = {};
      if (nome !== undefined) updateData.nome = nome;
      if (email !== undefined) updateData.email = email;
      if (senha !== undefined) updateData.senha = senha;
      
      const updatedUser = await this.userService.updateUser(userId, updateData);
      
      // Não retornar senha!
      const { senha: _, ...userSafe } = updatedUser;
      return res.json(userSafe);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId; // Obtém o ID do usuário do token JWT
      await this.userService.deleteUser(userId);
      return res.status(204).send(); // 204 No Content
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId; // Obtém o ID do usuário do token JWT
      const user = await this.userService.getUserById(userId);
      
      // Não retornar senha!
      const { senha: _, ...userSafe } = user;
      return res.json(userSafe);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
} 