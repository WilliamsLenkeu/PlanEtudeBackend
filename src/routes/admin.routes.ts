import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { validate } from '../middleware/validateMiddleware';
import { adminClearSchema, adminSeedSchema } from '../schemas/admin.schema';

const router = Router();

// Dashboard centralisé (GET) accessible via /api/admin/
router.get('/', adminController.renderDashboard);

// Action de seeding (SSE Stream)
router.get('/seed-stream', validate(adminSeedSchema), adminController.streamSeed);

// Stats MongoDB (GET)
router.get('/stats', adminController.getMongoStats);

// Supprimer un planning spécifique (DELETE)
router.delete('/planning/:id', adminController.deletePlanning);

// Nettoyage de la base (DELETE)
router.delete('/clear', validate(adminClearSchema), adminController.clearDatabase);

export default router;
