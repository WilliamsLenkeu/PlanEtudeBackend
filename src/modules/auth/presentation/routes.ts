import { Router } from 'express';
import { AuthController } from './AuthController';
import { UserController } from './UserController';
import { RegisterUserDto as RegisterUserSchema, LoginUserDto as LoginUserSchema, UpdateProfileDto as UpdateProfileSchema } from '../../../core/validation/schemas';

export function createAuthRoutes(
  authController: AuthController,
  userController: UserController
): Router {
  const router = Router();

  // Routes d'authentification
  router.post('/register', async (req, res, next) => {
    try {
      // Validation avec Zod
      const validatedData = RegisterUserSchema.parse(req.body);
      req.body = validatedData;
      await authController.register(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      const validatedData = LoginUserSchema.parse(req.body);
      req.body = validatedData;
      await authController.login(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  router.post('/google', authController.googleLogin);
  router.post('/refresh', authController.refreshToken);
  router.post('/logout', authController.logout);

  // Routes utilisateur (protégées)
  router.get('/profile', userController.getProfile);

  router.put('/profile', async (req, res, next) => {
    try {
      const validatedData = UpdateProfileSchema.parse(req.body);
      req.body = validatedData;
      await userController.updateProfile(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  router.get('/stats', userController.getUserStats);
  router.post('/unlock-theme', userController.unlockTheme);
  router.post('/add-subject', userController.addSubject);
  router.post('/remove-subject', userController.removeSubject);

  // Routes admin (protégées et nécessitant le rôle admin)
  router.get('/users', userController.getUsers);

  return router;
}