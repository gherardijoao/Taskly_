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
 *         categoria:
 *           type: string
 *           nullable: true
 *           description: Categoria ou grupo da tarefa
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *         dataCumprimento:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Data em que a tarefa foi concluída
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
 *         categoria:
 *           type: string
 *           nullable: true
 *         dataCumprimento:
 *           type: string
 *           format: date-time
 *           nullable: true
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
 *         categoria:
 *           type: string
 *           nullable: true
 *         dataCumprimento:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     ResumoTarefas:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: Total de tarefas
 *         concluidas:
 *           type: integer
 *           description: Total de tarefas concluídas
 *         pendentes:
 *           type: integer
 *           description: Total de tarefas pendentes
 *         porCategoria:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *           description: Contagem de tarefas por categoria
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
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar tarefas por categoria
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *         description: Buscar tarefas por texto no nome
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtro (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtro (YYYY-MM-DD)
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

/**
 * @openapi
 * /tarefas/categoria/{categoria}:
 *   get:
 *     summary: Lista tarefas por categoria
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome da categoria
 *     responses:
 *       200:
 *         description: Lista de tarefas da categoria
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
 * /tarefas/hoje:
 *   get:
 *     summary: Lista tarefas criadas hoje
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas de hoje
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
 * /tarefas/busca:
 *   get:
 *     summary: Busca tarefas por texto
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: busca
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto para busca
 *     responses:
 *       200:
 *         description: Lista de tarefas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tarefa'
 *       400:
 *         description: Termo de busca não fornecido
 *       401:
 *         description: Token não fornecido ou inválido
 */

/**
 * @openapi
 * /tarefas/resumo:
 *   get:
 *     summary: Obtém resumo estatístico das tarefas
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo das tarefas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResumoTarefas'
 *       401:
 *         description: Token não fornecido ou inválido
 */

/**
 * @openapi
 * /tarefas/sugestao:
 *   get:
 *     summary: Gera dicas e orientações para completar uma tarefa usando IA
 *     tags:
 *       - Tarefas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: context
 *         schema:
 *           type: string
 *         description: Contexto da tarefa para receber dicas
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Categoria da tarefa (opcional)
 *       - in: query
 *         name: preferencias
 *         schema:
 *           type: string
 *         description: Preferências do usuário para tipos de dicas (opcional)
 *     responses:
 *       200:
 *         description: Dicas e resumo gerados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dicas:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de dicas práticas para completar a tarefa
 *                 resumo:
 *                   type: string
 *                   description: Resumo motivacional ou estratégico para a tarefa
 *       401:
 *         description: Token não fornecido ou inválido
 *       500:
 *         description: Erro ao gerar dicas para a tarefa
 */

import { Router } from 'express';
import { TarefaController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { SuggestionController } from '../controllers/SuggestionController';

const router = Router();
const tarefaController = new TarefaController();
const suggestionController = new SuggestionController();

router.post('/tarefas', authMiddleware, async (req, res) => {
  await tarefaController.create(req, res);
});

router.get('/tarefas', authMiddleware, async (req, res) => {
  await tarefaController.getAll(req, res);
});

router.get('/tarefas/hoje', authMiddleware, async (req, res) => {
  await tarefaController.getTarefasHoje(req, res);
});

router.get('/tarefas/busca', authMiddleware, async (req, res) => {
  await tarefaController.buscarTarefas(req, res);
});

router.get('/tarefas/resumo', authMiddleware, async (req, res) => {
  await tarefaController.getResumoTarefas(req, res);
});

router.get('/tarefas/categoria/:categoria', authMiddleware, async (req, res) => {
  await tarefaController.getTarefasByCategoria(req, res);
});

router.get('/tarefas/sugestao', authMiddleware, async (req, res) => {
  await suggestionController.sugerirTarefa(req, res);
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