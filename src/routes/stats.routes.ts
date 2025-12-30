import express from 'express';
import { getStats, getSubjectStats, getRecommendations, getWeeklyReport, getHeatmapData } from '../controllers/statsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistiques d'apprentissage et coaching intelligent 📊
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
 */
router.get('/subjects', protect, getSubjectStats);

/**
 * @swagger
 * /stats/recommendations:
 *   get:
 *     summary: Obtenir des conseils d'étude personnalisés par l'IA Coach 🤖
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conseils récupérés avec succès 🌸
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - subject: "Maths"
 *                   progress: 15
 *                   advice: "Tu as un peu délaissé les Maths cette semaine. Une petite session de 20 min ? 🌸"
 *                   priority: "high"
 */
router.get('/recommendations', protect, getRecommendations);

/**
 * @swagger
 * /stats/weekly-report:
 *   get:
 *     summary: Générer un rapport de productivité hebdomadaire 📊
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rapport généré ✨
 */
router.get('/weekly-report', protect, getWeeklyReport);

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
