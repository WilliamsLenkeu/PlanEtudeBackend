import { Request, Response } from 'express';
import Progress from '../models/Progress.model';
import User from '../models/User.model';
import { addExperience, getRank } from '../utils/gamification';

interface AuthRequest extends Request {
  user?: any;
}

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const progress = await Progress.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({
      success: true,
      data: progress
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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

    // Ajouter de l'XP : 10 XP par session complétée + 1 XP par 10 minutes d'étude
    const xpToGain = (sessionsCompletees * 10) + Math.floor(tempsEtudie / 10);
    const newGamification = await addExperience(req.user.id, xpToGain, tempsEtudie);

    res.status(201).json({
      success: true,
      message: `Bravo ! Tu as gagné ${xpToGain} XP. ✨`,
      data: {
        progress,
        gamification: newGamification
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProgressSummary = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        const stats = await Progress.aggregate([
            { $match: { userId: user._id } },
            { $group: {
                _id: null,
                totalSessions: { $sum: "$sessionsCompletees" },
                totalTemps: { $sum: "$tempsEtudie" },
                count: { $sum: 1 }
            }}
        ]);

        const g = user.gamification || { totalXP: 0, xp: 0, level: 1 };
        const nextLevelXP = g.level * 100;
        const xpToNextLevel = nextLevelXP - g.xp;

        res.json({
            success: true,
            data: {
                totalXP: g.totalXP,
                currentXP: g.xp,
                level: g.level,
                xpToNextLevel: xpToNextLevel > 0 ? xpToNextLevel : 0,
                rank: getRank(g.level),
                stats: stats[0] || { totalSessions: 0, totalTemps: 0, count: 0 }
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};