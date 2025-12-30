import express from 'express';
import { 
  getSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject 
} from '../controllers/subjectController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { subjectSchema } from '../utils/validation';

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
 *     summary: Récupérer toutes tes matières 📚
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des matières
 *   post:
 *     summary: Créer une nouvelle matière 🎀
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
 *               name: { type: string, example: "Maths de l'Espace 🚀" }
 *               color: { type: string, example: "#FF69B4" }
 *               icon: { type: string, example: "calculator" }
 *               difficulty: { type: number, minimum: 1, maximum: 5, example: 4 }
 *               goalHoursPerWeek: { type: number, example: 5 }
 *     responses:
 *       201:
 *         description: Matière créée
 */
router.route('/')
  .get(getSubjects)
  .post(validate(subjectSchema), createSubject);

router.route('/:id')
  .put(validate(subjectSchema.partial()), updateSubject)
  .delete(deleteSubject);

export default router;
