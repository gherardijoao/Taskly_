/**
 * @openapi
 * components:
 *   schemas:
 *     Tarefa:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         idUsuario:
 *           type: string
 *           format: uuid
 *         nomeUsuario:
 *           type: string
 *           description: Nome do usuário proprietário da tarefa
 *         nome:
 *           type: string
 *         descricao:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [pendente, concluída]
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *     CreateTarefaRequest:
 *       type: object
 *       required:
 *         - nome
 *       properties:
 *         nome:
 *           type: string
 *           maxLength: 255
 *         descricao:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pendente, concluída]
 *           default: pendente
 *     UpdateTarefaRequest:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *           maxLength: 255
 *         descricao:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pendente, concluída]
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * /tarefas:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTarefaRequest'
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Token não fornecido ou inválido
 *   get:
 *     summary: Lista todas as tarefas do usuário
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, concluída]
 *         description: Filtrar tarefas por status
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarefa'
 *       401:
 *         description: Token não fornecido ou inválido
 */

/**
 * @openapi
 * /tarefas/{id}:
 *   get:
 *     summary: Busca uma tarefa por ID
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       404:
 *         description: Tarefa não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 *   put:
 *     summary: Atualiza uma tarefa
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTarefaRequest'
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Tarefa não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 *   delete:
 *     summary: Deleta uma tarefa
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da tarefa
 *     responses:
 *       204:
 *         description: Tarefa deletada com sucesso
 *       404:
 *         description: Tarefa não encontrada
 *       401:
 *         description: Token não fornecido ou inválido
 */

import { Router } from 'express';
import { TarefaController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const tarefaController = new TarefaController();

router.post('/tarefas', authMiddleware, async (req, res) => {
  await tarefaController.create(req, res);
});

router.get('/tarefas', authMiddleware, async (req, res) => {
  await tarefaController.getAll(req, res);
});

router.get('/tarefas/:id', authMiddleware, async (req, res) => {
  await tarefaController.getById(req, res);
});

router.put('/tarefas/:id', authMiddleware, async (req, res) => {
  await tarefaController.update(req, res);
});

router.delete('/tarefas/:id', authMiddleware, async (req, res) => {
  await tarefaController.delete(req, res);
});

export default router; 