import { Router } from 'express';
import { AdminController } from './AdminController';
import { protect } from '../../../middleware/authMiddleware';
import { requireAdmin, requireAdminOrModerator } from '../../../middleware/adminMiddleware';
import { validate } from '../../../middleware/validateMiddleware';
import { adminClearSchema, adminSeedSchema } from '../../../schemas/admin.schema';
import * as adminLegacyController from '../../../controllers/adminController';

export function createAdminRoutes(
  adminController: AdminController
): Router {
  const router = Router();

  // Page de connexion admin (sans auth)
  router.get('/login', (req, res) => res.render('admin/login'));

  // Redirection vers login si pas de token pour les requêtes GET /
  router.get('/', (req, res, next) => {
    const hasToken = req.headers.authorization?.startsWith('Bearer') || req.query.token;
    if (!hasToken) {
      return res.redirect('/api/admin/login');
    }
    next();
  });

  router.use(protect);
  router.use(requireAdmin);

  // Dashboard EJS + Seed (legacy controller)
  router.get('/', adminLegacyController.renderDashboard);
  router.get('/seed-stream', validate(adminSeedSchema), adminLegacyController.streamSeed);
  router.get('/stats', adminLegacyController.getMongoStats);
  router.delete('/planning/:id', adminLegacyController.deletePlanning);
  router.delete('/clear', validate(adminClearSchema), adminLegacyController.clearDatabase);

  router.get('/users', requireAdminOrModerator, adminController.getUsers);
  router.get('/users/:id', requireAdminOrModerator, adminController.getUserById);
  router.get('/users/:id/activity', requireAdminOrModerator, adminController.getUserActivity);
  router.post('/users/:id/block', adminController.blockUser);
  router.post('/users/:id/unblock', adminController.unblockUser);
  router.put('/users/:id/role', adminController.updateUserRole);
  router.delete('/users/:id', adminController.deleteUser);

  return router;
}