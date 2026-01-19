import mongoose from 'mongoose';
import { container, TOKENS } from './Container';

// Import des modèles (anciens) - temporairement gardés pour compatibilité
import UserModel from '../../models/User.model';
import RefreshTokenModel from '../../models/RefreshToken.model';
import PlanningModel from '../../models/Planning.model';
import ProgressModel from '../../models/Progress.model';

// Import des repositories
import { MongoUserRepository, MongoRefreshTokenRepository } from '../../modules/auth';

// Import des services Auth
import { AuthService, BcryptPasswordService, JwtService, GoogleAuthService } from '../../modules/auth/application/AuthService';
import { UserService as UserServiceClass } from '../../modules/auth/application/UserService';

// Import des services Planning
import { PlanningService } from '../../modules/planning/application/PlanningService';
import { MongoPlanningRepository } from '../../modules/planning/infrastructure/MongoPlanningRepository';

// Import des services Progress
import { ProgressService } from '../../modules/progress/application/ProgressService';
import { MongoProgressRepository } from '../../modules/progress/infrastructure/MongoProgressRepository';

// Configuration du container
export function configureContainer(): void {
  // Repositories
  container.register(TOKENS.USER_REPOSITORY, () => new MongoUserRepository(UserModel));
  container.register(TOKENS.REFRESH_TOKEN_REPOSITORY, () => new MongoRefreshTokenRepository(RefreshTokenModel));
  container.register(TOKENS.PLANNING_REPOSITORY, () => new MongoPlanningRepository(PlanningModel));
  container.register(TOKENS.PROGRESS_REPOSITORY, () => new MongoProgressRepository(ProgressModel));

  // Services utilitaires
  container.register(TOKENS.PASSWORD_HASHER, () => new BcryptPasswordService());
  container.register(TOKENS.JWT_SERVICE, () => new JwtService());
  container.register(TOKENS.GOOGLE_AUTH_SERVICE, () => new GoogleAuthService());

  // Services métier Auth
  container.register(TOKENS.AUTH_SERVICE, () => new AuthService(
    container.resolve(TOKENS.USER_REPOSITORY),
    container.resolve(TOKENS.REFRESH_TOKEN_REPOSITORY),
    container.resolve(TOKENS.PASSWORD_HASHER),
    container.resolve(TOKENS.JWT_SERVICE),
    container.resolve(TOKENS.GOOGLE_AUTH_SERVICE)
  ));

  container.register(TOKENS.USER_SERVICE, () => new UserServiceClass(
    container.resolve(TOKENS.USER_REPOSITORY)
  ));

  // Services métier Planning
  container.register(TOKENS.PLANNING_SERVICE, () => new PlanningService(
    container.resolve(TOKENS.PLANNING_REPOSITORY)
  ));

  // Services métier Progress
  container.register(TOKENS.PROGRESS_SERVICE, () => new ProgressService(
    container.resolve(TOKENS.PROGRESS_REPOSITORY)
  ));
}