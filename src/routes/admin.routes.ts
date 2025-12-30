import { Router } from 'express';
import * as adminController from '../controllers/adminController';

const router = Router();

// UI pour le seeding (GET)
router.get('/seed-ui', adminController.renderSeedUI);

// Action de seeding (POST)
router.post('/seed', adminController.runSeed);

export default router;
