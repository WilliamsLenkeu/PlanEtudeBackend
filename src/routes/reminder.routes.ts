import express from 'express';
import { createReminder, listReminders, deleteReminder, updateReminder } from '../controllers/reminderController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { reminderSchema } from '../utils/validation';

const router = express.Router();

router.use(protect);
/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Rappels et notifications d'étude 🔔
 */

/**
 * @swagger
 * /reminders:
 *   get:
 *     summary: Récupérer tous les rappels 🔔
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rappels récupérée 🍭
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "658af..."
 *                   title: "Révision Géo 🌍"
 *                   time: "2023-12-30T18:00:00Z"
 *                   isCompleted: false
 *   post:
 *     summary: Créer un nouveau rappel ✨
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, time]
 *             properties:
 *               title: { type: string, example: "Faire les devoirs de Maths 📐" }
 *               time: { type: string, format: date-time, example: "2023-12-30T17:00:00Z" }
 *     responses:
 *       201:
 *         description: Rappel créé avec succès 🍬
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Rappel ajouté ! Je te préviendrai. 🔔"
 */
router.route('/')
  .get(listReminders)
  .post(validate(reminderSchema), createReminder);

/**
 * @swagger
 * /reminders/{id}:
 *   put:
 *     summary: Modifier ou marquer un rappel comme complété ✅
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         example: "658af..."
 *     responses:
 *       200:
 *         description: Rappel mis à jour 🍭
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Rappel mis à jour ! ✨"
 */
router.route('/:id')
  .put(validate(reminderSchema.partial()), updateReminder)
  .delete(deleteReminder);

export default router;
