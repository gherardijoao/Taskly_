import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  login(req: Request, res: Response) {
    const { email, senha } = req.body;
    if (!email || !senha) {
      res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      return;
    }
    authService.authenticate(email, senha)
      .then(result => res.json(result))
      .catch((err: any) => res.status(401).json({ error: err.message }));
  }
} 