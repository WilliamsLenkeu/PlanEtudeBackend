import { Router } from 'express';
import { protect } from '../../../middleware/authMiddleware';
import { ThemeController } from './ThemeController';

export function createThemeRoutes(
  themeController: ThemeController
): Router {
  const router = Router();

  router.use(protect);

  router.get('/', themeController.getThemes);
  router.get('/key/:key', themeController.getThemeByKey);
  router.get('/:id', themeController.getThemeById);
  router.post('/', themeController.createTheme);
  router.put('/:id', themeController.updateTheme);
  router.delete('/:id', themeController.deleteTheme);

  return router;
}