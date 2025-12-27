import { Request, Response } from 'express';
import Reminder from '../models/Reminder.model';

interface AuthRequest extends Request { user?: any }

export const createReminder = async (req: AuthRequest, res: Response) => {
  try {
    const { title, date, planningId } = req.body;
    const reminder = await Reminder.create({ userId: req.user.id, title, date, planningId });
    res.status(201).json(reminder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const listReminders = async (req: AuthRequest, res: Response) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(reminders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReminder = async (req: AuthRequest, res: Response) => {
  try {
    const rem = await Reminder.findById(req.params.id);
    if (!rem) return res.status(404).json({ message: 'Rappel non trouvé' });
    if (rem.userId.toString() !== req.user.id) return res.status(401).json({ message: 'Non autorisé' });
    await rem.deleteOne();
    res.json({ message: 'Supprimé' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
