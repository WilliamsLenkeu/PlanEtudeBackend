import express from 'express';
import { chat, getMetrics } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { chatSchema } from '../utils/validation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Assistant d'étude IA (Mistral AI) 💬
 */

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Discuter avec l'assistant IA 🤖
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string, example: "Peux-tu m'aider à comprendre la photosynthèse ? 🌿" }
 *     responses:
 *       200:
 *         description: Réponse de l'IA
 */
router.post('/', protect, validate(chatSchema), chat);

/**
 * @swagger
 * /chat/metrics:
 *   get:
 *     summary: Récupérer les métriques d'utilisation du chat 📊
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métriques récupérées
 */
router.get('/metrics', protect, getMetrics);

export default router;