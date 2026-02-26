import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AppError } from './errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.originalUrl?.startsWith('/api/admin') && req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const currentUser = await User.findById(decoded.id).select('-password');
      if (!currentUser) {
        return next(new AppError('L\'utilisateur appartenant à ce token n\'existe plus', 401, 'AUTH'));
      }
      req.user = {
        ...decoded,
        email: (currentUser as any).email,
        role: (currentUser as any).role,
      };
      return next();
    } catch (error) {
      return next(new AppError('Non autorisé, session expirée ou token invalide', 401, 'AUTH'));
    }
  }

  return next(new AppError('Accès refusé - Aucun jeton d\'authentification fourni', 401, 'AUTH'));
};