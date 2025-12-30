import express from 'express';
import { getDashboardStats } from '../controllers/statsController';
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
 * /stats:
 *   get:
 *     summary: Récupérer les statistiques du tableau de bord 📈
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées
 */
router.get('/', protect, getDashboardStats);

export default router;
