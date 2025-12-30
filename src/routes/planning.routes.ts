import express from 'express';
import { 
  getPlannings, 
  createPlanning, 
  updatePlanning, 
  deletePlanning,
  exportIcal,
  exportPdf,
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
 *         description: Liste des plannings
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
 *                     subjectId: { type: string }
 *                     startTime: { type: string, format: date-time }
 *                     endTime: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Planning créé
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
 *     responses:
 *       200:
 *         description: Planning mis à jour
 *   delete:
 *     summary: Supprimer un planning 🗑️
 *     tags: [Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Planning supprimé
 */
router.route('/:id')
  .put(validate(planningSchema.partial()), updatePlanning)
  .delete(deletePlanning);

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