import express from 'express';
import { register, login, googleLogin, refreshToken } from '../controllers/authController';
import { validate } from '../middleware/validateMiddleware';
import { registerSchema, loginSchema } from '../utils/validation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification 🔐
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscrire un nouvel utilisateur 🎀
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Sakura }
 *               email: { type: string, format: email, example: sakura@love.com }
 *               password: { type: string, minLength: 6, example: secret123 }
 *               gender: { type: string, enum: [M, F, O], example: F }
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter à l'application 🍭
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: sakura@love.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', validate(loginSchema), login);
router.post('/google', googleLogin);
router.post('/refresh', refreshToken);

export default router;