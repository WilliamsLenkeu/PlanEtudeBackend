import express from 'express';
import { 
  getProgress, 
  createProgress, 
  getProgressSummary 
} from '../controllers/progressController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { progressSchema } from '../utils/validation';

const router = express.Router();

router.use(protect); // Toutes les routes progress sont protégées

router.get('/', getProgress);
router.post('/', validate(progressSchema), createProgress);
router.get('/summary', getProgressSummary);

export default router;