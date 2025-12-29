import express from 'express';
import { getProgress, createProgress, getProgressSummary } from '../controllers/progressController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { progressSchema } from '../utils/validation';

const router = express.Router();

router.route('/')
  .get(protect, getProgress)
  .post(protect, validate(progressSchema), createProgress);
router.get('/summary', getProgressSummary);

export default router;