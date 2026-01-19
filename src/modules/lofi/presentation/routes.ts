import { Router } from 'express';
import { LoFiController } from './LoFiController';

export function createLoFiRoutes(
  lofiController: LoFiController
): Router {
  const router = Router();

  router.get('/', lofiController.getTracks);
  router.get('/categories', lofiController.getCategories);
  router.get('/:id', lofiController.getTrackById);
  router.post('/', lofiController.createTrack);
  router.delete('/:id', lofiController.deleteTrack);

  return router;
}