import express from 'express';
import { 
  getPlannings, 
  createPlanning, 
  updatePlanning, 
  deletePlanning 
} from '../controllers/planningController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { planningSchema } from '../utils/validation';

const router = express.Router();

router.use(protect); // Toutes les routes planning sont protégées

router.get('/', getPlannings);
router.post('/', validate(planningSchema), createPlanning);
router.put('/:id', validate(planningSchema.partial()), updatePlanning);
router.delete('/:id', deletePlanning);

export default router;