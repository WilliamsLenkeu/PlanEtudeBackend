import express from 'express';
import { getProgress, createProgress, getProgressSummary } from '../controllers/progressController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { progressSchema } from '../utils/validation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Suivi des sessions d'étude et XP 📈
 */

/**
 * @swagger
 * /progress:
 *   get:
 *     summary: Récupérer tout l'historique de progression 📚
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique récupéré
 *   post:
 *     summary: Enregistrer une nouvelle session d'étude ✨
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [subjectId, durationMinutes]
 *             properties:
 *               subjectId: { type: string }
 *               durationMinutes: { type: number, example: 45 }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Session enregistrée et XP accordée
 */
router.route('/')
  .get(protect, getProgress)
  .post(protect, validate(progressSchema), createProgress);

/**
 * @swagger
 * /progress/summary:
 *   get:
 *     summary: Récupérer un résumé de la progression (XP totale, niveau) 🏆
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Résumé récupéré
 */
router.get('/summary', getProgressSummary);

export default router;