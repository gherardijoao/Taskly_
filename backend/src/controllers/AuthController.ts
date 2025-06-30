import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    
    try {
      const result = await this.authService.authenticate(email, senha);
      return res.json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }
} 