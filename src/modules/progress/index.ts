import { Router } from 'express';
import { container, TOKENS } from '../../core/container/Container';
import { ProgressController } from './presentation/ProgressController';
import { createProgressRoutes } from './presentation/routes';
import { IProgressService } from './application/Services';

export function createProgressModule(): Router {
  const progressService = container.resolve(TOKENS.PROGRESS_SERVICE) as unknown as IProgressService;
  const progressController = new ProgressController(progressService);
  return createProgressRoutes(progressController);
}

export { Progress } from './domain/Progress';
export { IProgressRepository } from './domain/Repositories';
export { IProgressService, IStatsService } from './application/Services';
export * from './presentation/Dtos';