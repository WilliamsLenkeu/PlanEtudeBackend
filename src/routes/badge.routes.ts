import express from 'express';
import { awardBadge, getBadges } from '../controllers/badgeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.get('/', getBadges);
router.post('/', awardBadge);

export default router;
