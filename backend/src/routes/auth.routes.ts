import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               senha:
 *                 type: string
 *                 example: minhaSenhaSegura
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     dataCriacao:
 *                       type: string
 *                     dataAtualizacao:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Email e senha são obrigatórios
 *       401:
 *         description: Usuário ou senha inválidos
 */
router.post('/login', (req, res) => {
  authController.login(req, res);
});

export default router; 