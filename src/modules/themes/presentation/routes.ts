import { Router } from 'express';
import { ThemeController } from './ThemeController';

export function createThemeRoutes(
  themeController: ThemeController
): Router {
  const router = Router();

  router.get('/', themeController.getThemes);
  router.get('/key/:key', themeController.getThemeByKey);
  router.get('/:id', themeController.getThemeById);
  router.post('/', themeController.createTheme);
  router.put('/:id', themeController.updateTheme);
  router.delete('/:id', themeController.deleteTheme);

  return router;
}