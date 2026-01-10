import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  origin: 'frontend' | 'backend';
  category: 'AUTH' | 'VALIDATION' | 'DATABASE' | 'NOT_FOUND' | 'INTERNAL' | 'NETWORK';

  constructor(message: string, statusCode: number, category?: 'AUTH' | 'VALIDATION' | 'DATABASE' | 'NOT_FOUND' | 'INTERNAL' | 'NETWORK') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.origin = statusCode >= 400 && statusCode < 500 ? 'frontend' : 'backend';
    
    if (category) {
      this.category = category;
    } else {
      // Déduction automatique de la catégorie basée sur le code de statut
      if (statusCode === 401 || statusCode === 403) this.category = 'AUTH';
      else if (statusCode === 404) this.category = 'NOT_FOUND';
      else if (statusCode === 400) this.category = 'VALIDATION';
      else this.category = 'INTERNAL';
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Catégorisation des erreurs spécifiques
  let category = err.category || 'INTERNAL';
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';

  // Erreurs MongoDB (CastError, Duplicate Key, etc.)
  if (err.name === 'CastError') {
    message = `Ressource non trouvée. ID invalide: ${err.value}`;
    statusCode = 400;
    category = 'DATABASE';
  } else if (err.code === 11000) {
    message = 'Valeur en double détectée dans la base de données';
    statusCode = 400;
    category = 'DATABASE';
  } else if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    statusCode = 400;
    category = 'VALIDATION';
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    message = 'Jeton invalide. Veuillez vous reconnecter.';
    statusCode = 401;
    category = 'AUTH';
  } else if (err.name === 'TokenExpiredError') {
    message = 'Votre session a expiré. Veuillez vous reconnecter.';
    statusCode = 401;
    category = 'AUTH';
  }

  const origin = statusCode >= 400 && statusCode < 500 ? 'frontend' : 'backend';
  
  // Génération de la trace (max 100 caractères)
  const trace = (err.stack || message).substring(0, 100).replace(/\n/g, ' ').trim();

  // Log de l'erreur avec l'origine et la catégorie
  logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} - [${origin.toUpperCase()}] [${category}] ${message}`);
  
  if (process.env.NODE_ENV !== 'production' && !err.isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({
    status: 'error',
    origin,
    category,
    message: origin === 'backend' 
      ? `Erreur Serveur [${category}]: ${message}` 
      : `Erreur Client [${category}]: ${message}`,
    trace: `${trace}...`,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route non trouvée - ${req.originalUrl}`, 404);
  next(error);
};