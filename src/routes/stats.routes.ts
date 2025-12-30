import express from 'express';
import { getStats, getSubjectStats } from '../controllers/statsController';
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
 *     summary: Récupérer les statistiques globales de l'utilisateur 📊
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès 📈
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 totalStudyTime: 1250
 *                 averageSessionDuration: 45
 *                 mostStudiedSubject: "Mathématiques 📐"
 *                 streakDays: 5
 */
router.get('/', protect, getStats);

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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - subject: "Maths"
 *                   minutes: 450
 *                   color: "#FFB6C1"
 *                 - subject: "Français"
 *                   minutes: 300
 *                   color: "#B19CD9"
 */
router.get('/subjects', protect, getSubjectStats);

export default router;
