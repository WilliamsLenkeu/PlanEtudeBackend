import { Router } from 'express';
import { AdminController } from './AdminController';
import { protect } from '../../../middleware/authMiddleware';
import { requireAdmin, requireAdminOrModerator } from '../../../middleware/adminMiddleware';

export function createAdminRoutes(
  adminController: AdminController
): Router {
  const router = Router();

  router.use(protect);
  router.use(requireAdmin);

  router.get('/stats', adminController.getStats);
  router.get('/users', requireAdminOrModerator, adminController.getUsers);
  router.get('/users/:id', requireAdminOrModerator, adminController.getUserById);
  router.get('/users/:id/activity', requireAdminOrModerator, adminController.getUserActivity);
  router.post('/users/:id/block', adminController.blockUser);
  router.post('/users/:id/unblock', adminController.unblockUser);
  router.put('/users/:id/role', adminController.updateUserRole);
  router.delete('/users/:id', adminController.deleteUser);

  return router;
}