import express from 'express';
import { getThemes, setCurrentTheme } from '../controllers/themeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Themes
 *   description: Boutique de thèmes pastel 🍭 (Maintenant gratuits !)
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
 *         description: Liste des thèmes et leurs configurations visuelles 🎨
 */
router.get('/', getThemes);

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
 *         example: "lavender-dream"
 *     responses:
 *       200:
 *         description: Thème mis à jour avec les variables visuelles 🍭
 */
router.put('/set/:key', setCurrentTheme);

export default router;
