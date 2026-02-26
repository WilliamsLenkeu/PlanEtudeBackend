import { Router } from 'express';
import { protect } from '../../../middleware/authMiddleware';
import { ProgressController } from './ProgressController';

export function createProgressRoutes(
  progressController: ProgressController
): Router {
  const router = Router();

  router.use(protect);

  router.post('/', progressController.recordProgress);
  router.get('/', progressController.getUserProgress);
  router.get('/summary', progressController.getProgressSummary);
  router.get('/history', progressController.getProgressHistory);
  router.get('/stats', progressController.getStats);
  router.get('/:id', progressController.getProgress);
  router.delete('/:id', progressController.deleteProgress);

  return router;
}