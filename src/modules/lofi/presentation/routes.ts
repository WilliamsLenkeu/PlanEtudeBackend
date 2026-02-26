import { Router } from 'express';
import { protect } from '../../../middleware/authMiddleware';
import { LoFiController } from './LoFiController';

export function createLoFiRoutes(
  lofiController: LoFiController
): Router {
  const router = Router();

  router.use(protect);

  router.get('/', lofiController.getTracks);
  router.get('/categories', lofiController.getCategories);
  router.get('/:id', lofiController.getTrackById);
  router.post('/', lofiController.createTrack);
  router.delete('/:id', lofiController.deleteTrack);

  return router;
}