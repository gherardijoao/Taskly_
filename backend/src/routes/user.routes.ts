/**
 * @openapi
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação ou e-mail já cadastrado
 * 
 * /profile:
 *   get:
 *     summary: Retorna os dados do usuário logado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autorizado
 *   put:
 *     summary: Atualiza os dados do usuário logado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *   delete:
 *     summary: Exclui a conta do usuário logado
 *     tags:
 *       - Usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Usuário excluído com sucesso
 *       401:
 *         description: Não autorizado
 */

import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const userController = new UserController();

router.post('/users', (req, res) => {
  userController.create(req, res);
});

// Rotas protegidas que exigem autenticação
router.get('/profile', authMiddleware, (req, res) => {
  userController.getProfile(req, res);
});

router.put('/profile', authMiddleware, (req, res) => {
  userController.update(req, res);
});

router.delete('/profile', authMiddleware, (req, res) => {
  userController.delete(req, res);
});

export default router; 