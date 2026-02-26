import { Router } from 'express';
import { protect } from '../../../middleware/authMiddleware';
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
  router.get('/profile', protect, userController.getProfile);

  router.put('/profile', protect, async (req, res, next) => {
    try {
      const validatedData = UpdateProfileSchema.parse(req.body);
      req.body = validatedData;
      await userController.updateProfile(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  router.get('/stats', protect, userController.getUserStats);
  router.post('/unlock-theme', protect, userController.unlockTheme);
  router.post('/add-subject', protect, userController.addSubject);
  router.post('/remove-subject', protect, userController.removeSubject);

  // Routes admin (protégées et nécessitant le rôle admin)
  router.get('/users', protect, userController.getUsers);

  return router;
}