import Reminder from '../models/Reminder.model';
import logger from '../utils/logger';

// Simple in-memory worker: check every minute for due reminders
export function startReminderWorker() {
  setInterval(async () => {
    try {
      const now = new Date();
      const due = await Reminder.find({ notified: false, date: { $lte: now } }).limit(50);
      for (const r of due) {
        // TODO: integrate with push service / web-push / FCM
        logger.info('Reminder due', { id: r._id, userId: r.userId, title: r.title });
        r.notified = true;
        await r.save();
      }
    } catch (e) {
      logger.error('Reminder worker error', e);
    }
  }, 60 * 1000);
}

export default { startReminderWorker };
