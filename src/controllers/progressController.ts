import { Request, Response } from 'express';
import Progress from '../models/Progress.model';

interface AuthRequest extends Request {
  user?: any;
}

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const progress = await Progress.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProgress = async (req: AuthRequest, res: Response) => {
  const { date, sessionsCompletees, tempsEtudie, notes } = req.body;

  try {
    const progress = await Progress.create({
      userId: req.user.id,
      date: date || Date.now(),
      sessionsCompletees,
      tempsEtudie,
      notes,
    });
    res.status(201).json(progress);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProgressSummary = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await Progress.aggregate([
            { $match: { userId: req.user.id } },
            { $group: {
                _id: null,
                totalSessions: { $sum: "$sessionsCompletees" },
                totalTemps: { $sum: "$tempsEtudie" },
                count: { $sum: 1 }
            }}
        ]);
        res.json(stats[0] || { totalSessions: 0, totalTemps: 0, count: 0 });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};