import express from 'express';
import { 
  getSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject 
} from '../controllers/subjectController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { subjectSchema } from '../schemas/common.schema';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Gestion des matières personnalisées 🎨
 */

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Liste toutes les matières de l'utilisateur 📚
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matières récupérée 🍭
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: "658bc..."
 *                   name: "Mathématiques 📐"
 *                   color: "#FFB6C1"
 *                   totalStudyTime: 450
 *   post:
 *     summary: Ajouter une nouvelle matière 🎨
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Histoire 🏰" }
 *               color: { type: string, example: "#B19CD9" }
 *     responses:
 *       201:
 *         description: Matière créée avec succès ✨
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Nouvelle matière ajoutée ! ✨"
 *               data: { id: "658bd...", name: "Histoire 🏰" }
 */
router.route('/')
  .get(getSubjects)
  .post(validate(subjectSchema), createSubject);

/**
 * @swagger
 * /subjects/{id}:
 *   put:
 *     summary: Modifier une matière 📝
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         example: "658bc..."
 *     responses:
 *       200:
 *         description: Matière mise à jour 🍬
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Matière mise à jour ! ✨"
 */
router.route('/:id')
  .put(validate(subjectSchema.partial()), updateSubject)
  .delete(deleteSubject);

export default router;
