import express from 'express';
import { 
  getPlannings, 
  createPlanning, 
  updatePlanning, 
  deletePlanning,
  exportIcal,
  exportPdf,
  updateSessionStatus,
} from '../controllers/planningController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { planningSchema } from '../utils/validation';

const router = express.Router();

router.use(protect); // Toutes les routes planning sont protégées

/**
 * @swagger
 * tags:
 *   name: Planning
 *   description: Gestion de l'emploi du temps intelligent 📅
 */

/**
 * @swagger
 * /planning:
 *   get:
 *     summary: Récupérer tous les plannings de l'utilisateur 🗓️
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des plannings récupérée ✨
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "658af..."
 *                   title: "Semaine d'Examens 📚"
 *                   sessions:
 *                     - subjectId: "658bc..."
 *                       startTime: "2023-12-30T09:00:00Z"
 *                       endTime: "2023-12-30T11:00:00Z"
 *   post:
 *     summary: Créer ou générer un nouveau planning 🤖
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, sessions]
 *             properties:
 *               title: { type: string, example: "Ma semaine de révisions 📚" }
 *               sessions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subjectId: { type: string, example: "658bc..." }
 *                     startTime: { type: string, format: date-time, example: "2023-12-30T14:00:00Z" }
 *                     endTime: { type: string, format: date-time, example: "2023-12-30T16:00:00Z" }
 *     responses:
 *       201:
 *         description: Planning créé avec succès ✨
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Planning généré et enregistré ! 🤖"
 *               data: { id: "658af...", title: "Ma semaine de révisions 📚" }
 */
router.route('/')
  .get(getPlannings)
  .post(validate(planningSchema), createPlanning);

/**
 * @swagger
 * /planning/{id}:
 *   put:
 *     summary: Mettre à jour un planning existant 📝
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         example: "658af..."
 *     responses:
 *       200:
 *         description: Planning mis à jour avec succès 🍭
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Planning mis à jour ! ✨"
 *   delete:
 *     summary: Supprimer un planning 🗑️
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         example: "658af..."
 *     responses:
 *       200:
 *         description: Planning supprimé 🍬
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Planning supprimé définitivement. 🗑️"
 */
router.route('/:id')
  .put(validate(planningSchema.partial()), updatePlanning)
  .delete(deletePlanning);

/**
 * @swagger
 * /planning/{id}/sessions/{sessionId}:
 *   patch:
 *     summary: Mettre à jour le statut d'une session spécifique (ex: terminer) ✨
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du planning
 *       - in: path
 *         name: sessionId
 *         required: true
 *         description: ID de la session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut: { type: string, enum: [planifie, en_cours, termine, rate], example: "termine" }
 *               notes: { type: string, example: "Session très productive !" }
 *     responses:
 *       200:
 *         description: Statut mis à jour et XP gagnés 🎁
 */
router.patch('/:id/sessions/:sessionId', updateSessionStatus);

/**
 * @swagger
 * /planning/{id}/export.ical:
 *   get:
 *     summary: Exporter un planning au format iCal 📅
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Fichier iCal généré
 */
router.get('/:id/export.ical', exportIcal);

/**
 * @swagger
 * /planning/{id}/export.pdf:
 *   get:
 *     summary: Exporter un planning en PDF (format Girly 🎀)
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Fichier PDF généré
 */
router.get('/:id/export.pdf', exportPdf);

export default router;