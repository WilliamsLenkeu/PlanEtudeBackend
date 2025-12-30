import express from 'express';
import { createReminder, listReminders, deleteReminder } from '../controllers/reminderController';
import { protect } from '../middleware/authMiddleware';

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
 *     summary: Lister tous mes rappels 📜
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rappels
 *   post:
 *     summary: Créer un nouveau rappel 🎀
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, scheduledAt]
 *             properties:
 *               title: { type: string, example: "Réviser la géo ! 🌍" }
 *               scheduledAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Rappel créé
 */
router.get('/', listReminders);
router.post('/', createReminder);

/**
 * @swagger
 * /reminders/{id}:
 *   delete:
 *     summary: Supprimer un rappel 🗑️
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Rappel supprimé
 */
router.delete('/:id', deleteReminder);

export default router;
