import express from 'express';
import { chat, getMetrics } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { chatSchema } from '../utils/validation';

const router = express.Router();

router.post('/', protect, validate(chatSchema), chat);
router.get('/metrics', protect, getMetrics);

export default router;