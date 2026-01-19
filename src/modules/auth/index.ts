import { Router } from 'express';
import { container, TOKENS } from '../../core/container/Container';
import { AuthController } from './presentation/AuthController';
import { UserController } from './presentation/UserController';
import { createAuthRoutes } from './presentation/routes';

// Assemblage du module Auth
export function createAuthModule(): Router {
  // Récupérer les services depuis le container
  const authService = container.resolve(TOKENS.AUTH_SERVICE) as import('./application/Services').IAuthService;
  const userService = container.resolve(TOKENS.USER_SERVICE) as import('./application/Services').IUserService;

  // Créer les contrôleurs
  const authController = new AuthController(authService);
  const userController = new UserController(userService);

  // Créer les routes
  return createAuthRoutes(authController, userController);
}

// Export des types et interfaces pour les autres modules
export * from './domain/User';
export * from './domain/Repositories';
export * from './application/Services';
export * from './presentation/Dtos';

// Export des repositories pour les autres modules
export { MongoUserRepository, MongoRefreshTokenRepository } from './infrastructure/MongoUserRepository';