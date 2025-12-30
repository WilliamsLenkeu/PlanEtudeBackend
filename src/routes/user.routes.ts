import express from 'express';
import { getUserProfile, updateUserProfile, changePassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { updateProfileSchema, changePasswordSchema } from '../utils/validation';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion du profil utilisateur 👤
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté ✨
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès 🌸
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 name: "Sakura"
 *                 email: "sakura@love.com"
 *                 rank: "Nouvelle Étoile 🌟"
 *                 gamification:
 *                   totalXP: 1250
 *                   xp: 50
 *                   level: 12
 *                   streak: 5
 *                   dailyQuests:
 *                     - title: "Concentration Intense 🧠"
 *                       description: "Étudie pendant au moins 30 minutes au total aujourd'hui."
 *                       xpReward: 50
 *                       isCompleted: false
 *                       target: 30
 *                       current: 12
 *                 preferences: { matieres: ["Maths", "Art"] }
 *                 themeConfig:
 *                   primaryColor: "#FFB6C1"
 *                   secondaryColor: "#FFD1DC"
 *                   fontFamily: "'Quicksand', sans-serif"
 *   put:
 *     summary: Mettre à jour les informations du profil 📝
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Sakura Pink" }
 *               gender: { type: string, enum: [M, F, O], example: F }
 *               avatar: { type: string, example: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sakura" }
 *               preferences:
 *                 type: object
 *                 properties:
 *                   matieres: { type: array, items: { type: string }, example: ["Maths", "Design"] }
 *     responses:
 *       200:
 *         description: Profil mis à jour ✨
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Profil mis à jour avec succès ! ✨"
 *               data: { name: "Sakura Pink", gender: "F" }
 */
router.route('/profile')
  .get(getUserProfile)
  .put(validate(updateProfileSchema), updateUserProfile);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Changer le mot de passe de l'utilisateur 🍭
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string, example: "ancienMDP123" }
 *               newPassword: { type: string, example: "nouveauMDP456" }
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès 🍬
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Mot de passe modifié avec succès ! 🍭"
 *       400:
 *         description: Ancien mot de passe incorrect ❌
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "L'ancien mot de passe est incorrect. 🍯"
 */
router.put('/change-password', validate(changePasswordSchema), changePassword);

export default router;