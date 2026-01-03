import express from 'express';
import { getProgress, createProgress, getProgressSummary } from '../controllers/progressController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { progressSchema } from '../schemas/common.schema';

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
 *         description: Historique récupéré avec succès ✨
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - subjectId: "658bc..."
 *                   durationMinutes: 45
 *                   xpGained: 15
 *                   date: "2023-12-30T10:00:00Z"
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
 *               subjectId: { type: string, example: "658bc..." }
 *               durationMinutes: { type: number, example: 45 }
 *               notes: { type: string, example: "Révision des équations. ✏️" }
 *     responses:
 *       201:
 *         description: Session enregistrée et XP accordée 🎉
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Bravo ! Tu as gagné 15 XP. ✨"
 *               data: { xpGained: 15, newTotalXP: 165 }
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
 *         description: Résumé récupéré avec succès 🍭
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 totalXP: 165
 *                 level: 2
 *                 xpToNextLevel: 35
 *                 rank: "Apprentie studieuse 🎀"
 */
router.get('/summary', getProgressSummary);

export default router;