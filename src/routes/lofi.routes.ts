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
 *     responses:
 *       200:
 *         description: Liste des pistes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: number, example: 30 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title: { type: string, example: "Matin Calme 🌸" }
 *                       artist: { type: string, example: "Jamendo Artist" }
 *                       url: { type: string, example: "https://..." }
 *                       thumbnail: { type: string, example: "https://..." }
 *                       category: { type: string, example: "relax" }
 */
router.get('/', getLofiTracks);

/**
 * @swagger
 * /lofi:
 *   post:
 *     summary: Ajouter une piste Lo-Fi (Admin) ☁️
 *     tags: [LoFi]
 *     responses:
 *       201:
 *         description: Piste ajoutée
 */
router.post('/', addLofiTrack);

export default router;
