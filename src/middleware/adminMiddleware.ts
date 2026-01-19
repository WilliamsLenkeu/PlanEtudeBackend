import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Accès refusé - Authentification requise', 401, 'AUTH'));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Accès refusé - Privilèges administrateur requis', 403, 'AUTH'));
  }

  next();
};

export const requireAdminOrModerator = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Accès refusé - Authentification requise', 401, 'AUTH'));
  }

  if (!['admin', 'moderator'].includes(req.user.role)) {
    return next(new AppError('Accès refusé - Privilèges administrateur ou modérateur requis', 403, 'AUTH'));
  }

  next();
};
