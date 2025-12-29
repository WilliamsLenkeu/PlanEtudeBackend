import { Request, Response } from 'express';
import Progress from '../models/Progress.model';
import Planning from '../models/Planning.model';
import User from '../models/User.model';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // 1. Récupérer les 7 derniers jours de progrès
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const progressHistory = await Progress.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // 2. Calculer le taux de complétion des plannings
    const totalSessions = await Planning.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$sessions' },
      { $count: 'total' }
    ]);

    const completedSessions = await Planning.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$sessions' },
      { $match: { 'sessions.statut': 'termine' } },
      { $count: 'total' }
    ]);

    const totalCount = totalSessions[0]?.total || 0;
    const completedCount = completedSessions[0]?.total || 0;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // 3. Temps d'étude par matière (via Planning)
    const timeBySubject = await Planning.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$sessions' },
      { $match: { 'sessions.statut': 'termine' } },
      {
        $group: {
          _id: '$sessions.matiere',
          totalMinutes: {
            $sum: {
              $divide: [
                { $subtract: ['$sessions.fin', '$sessions.debut'] },
                1000 * 60
              ]
            }
          }
        }
      },
      { $sort: { totalMinutes: -1 } }
    ]);

    res.json({
      gamification: user.gamification,
      completionRate: Math.round(completionRate),
      totalSessions: totalCount,
      completedSessions: completedCount,
      timeBySubject,
      progressHistory
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
