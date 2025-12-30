import express from 'express';
import { awardBadge, getBadges } from '../controllers/badgeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
/**
 * @swagger
 * tags:
 *   name: Badges
 *   description: Système de récompenses et accomplissements 🏆
 */

/**
 * @swagger
 * /badges:
 *   get:
 *     summary: Liste tous les badges disponibles et obtenus 🎖️
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des badges
 *   post:
 *     summary: Accorder un badge à l'utilisateur (Admin) 🎖️
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [badgeId]
 *             properties:
 *               badgeId: { type: string }
 *     responses:
 *       200:
 *         description: Badge accordé
 */
router.get('/', getBadges);
router.post('/', awardBadge);

export default router;
