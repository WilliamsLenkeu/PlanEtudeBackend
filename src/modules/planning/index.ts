import { Router } from 'express';
import { container, TOKENS } from '../../core/container/Container';
import { PlanningController } from './presentation/PlanningController';
import { createPlanningRoutes } from './presentation/routes';
import { IPlanningService } from './application/Services';

// Assemblage du module Planning
export function createPlanningModule(): Router {
  // Récupérer les services depuis le container
  const planningService = container.resolve(TOKENS.PLANNING_SERVICE) as unknown as IPlanningService;

  // Créer le contrôleur
  const planningController = new PlanningController(planningService);

  // Créer les routes
  return createPlanningRoutes(planningController);
}

// Export des types et interfaces pour les autres modules
export * from './domain/Planning';
export * from './domain/Repositories';
export * from './application/Services';
export * from './presentation/Dtos';