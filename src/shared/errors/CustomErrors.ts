// Classes d'erreur métier
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly type: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, type: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }

  public details?: any;
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Non authentifié') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Accès non autorisé') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Ressource') {
    super(`${resource} non trouvée`, 404, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflit de données') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Trop de requêtes') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = 'Service externe indisponible') {
    super(`${service}: ${message}`, 502, 'EXTERNAL_SERVICE_ERROR');
  }
}

// Factory pour créer des erreurs selon le contexte
export class ErrorFactory {
  static userNotFound(id?: string): NotFoundError {
    return new NotFoundError(id ? `Utilisateur ${id}` : 'Utilisateur');
  }

  static planningNotFound(id?: string): NotFoundError {
    return new NotFoundError(id ? `Planning ${id}` : 'Planning');
  }

  static subjectNotFound(id?: string): NotFoundError {
    return new NotFoundError(id ? `Matière ${id}` : 'Matière');
  }

  static themeNotFound(id?: string): NotFoundError {
    return new NotFoundError(id ? `Thème ${id}` : 'Thème');
  }

  static invalidCredentials(): AuthenticationError {
    return new AuthenticationError('Email ou mot de passe incorrect');
  }

  static userAlreadyExists(email: string): ConflictError {
    return new ConflictError(`Un utilisateur avec l'email ${email} existe déjà`);
  }

  static insufficientPermissions(): AuthorizationError {
    return new AuthorizationError('Permissions insuffisantes');
  }

  static geminiServiceUnavailable(): ExternalServiceError {
    return new ExternalServiceError('Gemini AI', 'Service temporairement indisponible');
  }

  static databaseError(operation: string): AppError {
    return new AppError(`Erreur de base de données lors de ${operation}`, 500, 'DATABASE_ERROR');
  }
}