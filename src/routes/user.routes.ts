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
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     email: { type: string }
 *                     xp: { type: number }
 *                     level: { type: number }
 *                     themeConfig: { type: object }
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
 *               name: { type: string }
 *               gender: { type: string, enum: [M, F, O] }
 *               avatar: { type: string }
 *               preferences:
 *                 type: object
 *                 properties:
 *                   matieres: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Profil mis à jour
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
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 */
router.put('/change-password', validate(changePasswordSchema), changePassword);

export default router;