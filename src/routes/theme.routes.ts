import express from 'express';
import { getThemes, unlockTheme, setCurrentTheme } from '../controllers/themeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Themes
 *   description: Boutique de thèmes pastel 🍭
 */

/**
 * @swagger
 * /themes:
 *   get:
 *     summary: Liste tous les thèmes disponibles avec config complète 🎀
 *     tags: [Themes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des thèmes et leurs configurations visuelles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key: { type: string }
 *                       name: { type: string }
 *                       description: { type: string }
 *                       priceXP: { type: number }
 *                       isPremium: { type: boolean }
 *                       config: { type: object }
 */
router.get('/', getThemes);

/**
 * @swagger
 * /themes/unlock/{key}:
 *   post:
 *     summary: Débloquer un thème avec de l'XP ✨
 *     tags: [Themes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thème débloqué
 *       400:
 *         description: XP insuffisante ou thème déjà débloqué
 */
router.post('/unlock/:key', unlockTheme);

/**
 * @swagger
 * /themes/set/{key}:
 *   put:
 *     summary: Changer le thème actuel et récupérer sa config 🌸
 *     tags: [Themes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thème mis à jour avec les variables visuelles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentTheme: { type: string }
 *                     themeConfig: { type: object }
 */
router.put('/set/:key', setCurrentTheme);

export default router;
