import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import logger from '../utils/logger';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Validation error:', { errors: error.errors, body: req.body });
      return res.status(400).json({
        message: "Erreur de validation",
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};