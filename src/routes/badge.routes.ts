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
 *     summary: Liste tous les badges disponibles et leur statut ✨
 *     tags: [Badges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des badges récupérée 🏆
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - key: "early-bird"
 *                   name: "Lève-tôt 🌅"
 *                   description: "A étudié avant 8h du matin."
 *                   isUnlocked: true
 *                   unlockedAt: "2023-12-30T07:30:00Z"
 *                 - key: "study-streak-5"
 *                   name: "Régularité 📚"
 *                   description: "5 jours de révisions consécutifs."
 *                   isUnlocked: false
 *   post:
 *     summary: Accorder un badge à l'utilisateur (Admin) 🎖️
 *     tags: [Badges]
 *     security:      - bearerAuth: []
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
router.get('/', protect, getBadges);
router.post('/', awardBadge);

export default router;
