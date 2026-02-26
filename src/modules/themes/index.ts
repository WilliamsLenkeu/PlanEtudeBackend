import { Router } from 'express';
import { container, TOKENS } from '../../core/container/Container';
import { ThemeController } from './presentation/ThemeController';
import { createThemeRoutes } from './presentation/routes';
import { ThemeService } from './application/ThemeService';
import { MongoThemeRepository } from './infrastructure/MongoThemeRepository';

export function createThemeModule(): Router {
  if (!container.has('ThemeRepository')) {
    const ThemeModule = require('../../models/Theme.model');
    const ThemeModel = ThemeModule.default ?? ThemeModule;
    container.register('ThemeRepository', () => new MongoThemeRepository(ThemeModel));
  }

  if (!container.has(TOKENS.THEME_SERVICE)) {
    container.register(TOKENS.THEME_SERVICE, () => new ThemeService(
      container.resolve('ThemeRepository')
    ));
  }

  const themeService = container.resolve(TOKENS.THEME_SERVICE) as ThemeService;
  const themeController = new ThemeController(themeService);
  return createThemeRoutes(themeController);
}

export * from './domain/Theme';
export * from './domain/Repositories';
export * from './application/ThemeService';
export * from './presentation/Dtos';