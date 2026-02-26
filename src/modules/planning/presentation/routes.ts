import { Router } from 'express';
import { protect } from '../../../middleware/authMiddleware';
import { PlanningController } from './PlanningController';
import { CreatePlanningDto, UpdatePlanningDto } from '../../../core/validation/schemas';

export function createPlanningRoutes(
  planningController: PlanningController
): Router {
  const router = Router();

  router.use(protect);

  // Routes CRUD pour les plannings
  router.post('/', async (req, res, next) => {
    try {
      const validatedData = CreatePlanningDto.parse(req.body);
      req.body = validatedData;
      await planningController.createPlanning(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  router.get('/', planningController.getUserPlannings);
  router.get('/:id', planningController.getPlanning);

  router.put('/:id', async (req, res, next) => {
    try {
      const validatedData = UpdatePlanningDto.parse(req.body);
      req.body = validatedData;
      await planningController.updatePlanning(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  router.delete('/:id', planningController.deletePlanning);

  // Routes pour les sessions
  router.post('/:id/sessions', planningController.addSession);
  router.put('/:id/sessions/:sessionId', planningController.updateSession);
  router.delete('/:id/sessions/:sessionId', planningController.deleteSession);

  // Routes d'export
  router.get('/:id/export.ical', planningController.exportICal);

  return router;
}