// Container de dependency injection simple
export class Container {
  private static instance: Container;
  private services = new Map<string, any>();

  private constructor() {}

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Enregistrer un service
  register<T>(token: string, factory: () => T): void {
    this.services.set(token, factory);
  }

  // Résoudre un service
  resolve<T>(token: string): T {
    const factory = this.services.get(token);
    if (!factory) {
      throw new Error(`Service non enregistré: ${token}`);
    }
    return factory();
  }

  // Vérifier si un service est enregistré
  has(token: string): boolean {
    return this.services.has(token);
  }

  // Supprimer un service
  remove(token: string): void {
    this.services.delete(token);
  }

  // Lister tous les services enregistrés
  listServices(): string[] {
    return Array.from(this.services.keys());
  }
}

// Instance globale du container
export const container = Container.getInstance();

// Tokens pour les services
export const TOKENS = {
  // Repositories
  USER_REPOSITORY: 'UserRepository',
  PLANNING_REPOSITORY: 'PlanningRepository',
  PROGRESS_REPOSITORY: 'ProgressRepository',
  SUBJECT_REPOSITORY: 'SubjectRepository',
  THEME_REPOSITORY: 'ThemeRepository',
  LOFI_REPOSITORY: 'LofiRepository',
  REFRESH_TOKEN_REPOSITORY: 'RefreshTokenRepository',

  // Services métier
  AUTH_SERVICE: 'AuthService',
  USER_SERVICE: 'UserService',
  PLANNING_SERVICE: 'PlanningService',
  PROGRESS_SERVICE: 'ProgressService',
  STATS_SERVICE: 'StatsService',
  SUBJECT_SERVICE: 'SubjectService',
  THEME_SERVICE: 'ThemeService',
  LOFI_SERVICE: 'LofiService',

  // Services externes
  GEMINI_SERVICE: 'GeminiService',
  GOOGLE_AUTH_SERVICE: 'GoogleAuthService',
  EMAIL_SERVICE: 'EmailService',
  NOTIFICATION_SERVICE: 'NotificationService',

  // Utilitaires
  PASSWORD_HASHER: 'PasswordHasher',
  JWT_SERVICE: 'JwtService',
  CACHE_SERVICE: 'CacheService'
} as const;