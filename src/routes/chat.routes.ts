import express from 'express';
import { chat, getMetrics } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, chat);
router.get('/metrics', protect, getMetrics);

export default router;