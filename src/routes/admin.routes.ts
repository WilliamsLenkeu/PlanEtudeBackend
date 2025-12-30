import { Router } from 'express';
import * as adminController from '../controllers/adminController';

const router = Router();

// Dashboard centralisé (GET)
router.get('/dashboard', adminController.renderDashboard);

// Action de seeding (SSE Stream)
router.get('/seed-stream', adminController.streamSeed);

// Stats MongoDB (GET)
router.get('/stats', adminController.getMongoStats);

// Nettoyage de la base (DELETE)
router.delete('/clear', adminController.clearDatabase);

export default router;
