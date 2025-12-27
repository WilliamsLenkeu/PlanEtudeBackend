import express from 'express';
import { createReminder, listReminders, deleteReminder } from '../controllers/reminderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.get('/', listReminders);
router.post('/', createReminder);
router.delete('/:id', deleteReminder);

export default router;
