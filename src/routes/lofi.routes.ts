import express from 'express';
import { getLofiTracks, addLofiTrack } from '../controllers/lofiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: LoFi
 *   description: Lecteur Lo-Fi pour étudier 🎵
 */

/**
 * @swagger
 * /lofi:
 *   get:
 *     summary: Liste les pistes Lo-Fi relaxantes (DB + Jamendo) 🎧
 *     tags: [LoFi]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des pistes récupérées avec succès 🎵
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               count: 2
 *               data:
 *                 - title: "Matin Calme 🌸"
 *                   artist: "Lofi Girl"
 *                   url: "https://api.jamendo.com/v3.0/tracks/..."
 *                   thumbnail: "https://images.unsplash.com/..."
 *                   category: "relax"
 *                 - title: "Focus & Study 📚"
 *                   artist: "Chill Hop"
 *                   url: "https://api.jamendo.com/..."
 *                   thumbnail: "https://images.unsplash.com/..."
 *                   category: "focus"
 */
router.get('/', getLofiTracks);

/**
 * @swagger
 * /lofi:
 *   post:
 *     summary: Ajouter une piste Lo-Fi (Admin) ☁️
 *     tags: [LoFi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, example: "Nuit Étoilée 🌙" }
 *               artist: { type: string, example: "Lofi Princess" }
 *               url: { type: string, example: "https://youtube.com/..." }
 *               thumbnail: { type: string, example: "https://img.youtube.com/..." }
 *               category: { type: string, example: "relax" }
 *     responses:
 *       201:
 *         description: Piste ajoutée avec succès ✨
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Nouvelle piste ajoutée à la collection ! 🎵"
 */
router.post('/', addLofiTrack);

export default router;
