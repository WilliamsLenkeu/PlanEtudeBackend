import express from 'express';
import { getSubjectStats, getHeatmapData } from '../controllers/statsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistiques d'apprentissage 📊
 */

/**
 * @swagger
 * /stats/subjects:
 *   get:
 *     summary: Récupérer la répartition du temps par matière 🍕
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Répartition récupérée ✨
 */
router.get('/subjects', protect, getSubjectStats);

/**
 * @swagger
 * /stats/heatmap:
 *   get:
 *     summary: Récupérer les données d'intensité d'étude pour le Heatmap 🔥
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Données heatmap récupérées 📈
 */
router.get('/heatmap', protect, getHeatmapData);

export default router;
