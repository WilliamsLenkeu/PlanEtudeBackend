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
 *         description: Liste des thèmes et leurs configurations visuelles 🎨
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - key: "strawberry-milk"
 *                   name: "Lait Fraise 🍓"
 *                   priceXP: 500
 *                   config:
 *                     primaryColor: "#FF8DA1"
 *                     backgroundColor: "#FFF5F6"
 *                     fontFamily: "'Fredoka', sans-serif"
 *                 - key: "lavender-dream"
 *                   name: "Rêve de Lavande 💜"
 *                   priceXP: 1000
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
 *         example: "strawberry-milk"
 *     responses:
 *       200:
 *         description: Thème débloqué avec succès 🎉
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Thème Lait Fraise 🍓 débloqué ! Profites-en bien. ✨"
 *       400:
 *         description: XP insuffisante ou thème déjà débloqué ❌
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Tu n'as pas assez d'XP pour ce thème. Continue d'étudier ! 💪"
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
 *         example: "lavender-dream"
 *     responses:
 *       200:
 *         description: Thème mis à jour avec les variables visuelles 🍭
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Thème mis à jour ! 🌸"
 *               data:
 *                 currentTheme: "lavender-dream"
 *                 themeConfig:
 *                   primaryColor: "#B19CD9"
 *                   secondaryColor: "#E6E6FA"
 *                   fontFamily: "'Nunito', sans-serif"
 */
router.put('/set/:key', setCurrentTheme);

export default router;
