import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { AppError } from './errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      
      // Vérifier si l'utilisateur existe toujours
      const currentUser = await User.findById(decoded.id).select('-password');
      if (!currentUser) {
        return next(new AppError('L\'utilisateur appartenant à ce token n\'existe plus', 401, 'AUTH'));
      }

      req.user = decoded;
      return next();
    } catch (error) {
      return next(new AppError('Non autorisé, session expirée ou token invalide', 401, 'AUTH'));
    }
  }

  if (!token) {
    return next(new AppError('Accès refusé - Aucun jeton d\'authentification fourni', 401, 'AUTH'));
  }
};