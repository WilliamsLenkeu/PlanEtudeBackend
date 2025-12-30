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
 *         description: Utilisateur créé avec succès ✨
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Compte créé avec succès ! Bienvenue 🌸"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5..."
 *               user: { id: "658af...", name: "Sakura", email: "sakura@love.com" }
 *       400:
 *         description: Données invalides ou email déjà utilisé ❌
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Cet email est déjà utilisé par une autre princesse. 🎀"
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
 *         description: Connexion réussie 💖
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               token: "eyJhbGciOiJIUzI1NiIsInR5..."
 *               user: { id: "658af...", name: "Sakura", xp: 150, level: 2 }
 *       401:
 *         description: Identifiants incorrects 🔑
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Oups ! Mot de passe ou email incorrect. 🍬"
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rafraîchir le token d'accès 🔄
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Nouveau token généré
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               accessToken: "eyJhbGciOiJIUzI1Ni..."
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Connexion via Google 🌐
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Connexion réussie via Google
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               token: "eyJhbGciOiJIUzI1Ni..."
 */
router.post('/google', googleLogin);

export default router;