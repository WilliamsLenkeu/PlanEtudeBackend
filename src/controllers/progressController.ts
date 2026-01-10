import { Request, Response, NextFunction } from 'express';
import Progress from '../models/Progress.model';
import User from '../models/User.model';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const getProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const progress = await Progress.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({
      success: true,
      data: progress
    });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la récupération de la progression: ${error.message}`, 500));
  }
};

export const createProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { date, sessionsCompletees, tempsEtudie, notes, subjectName } = req.body;

  try {
    const progress = await Progress.create({
      userId: req.user.id,
      date: date || Date.now(),
      sessionsCompletees,
      tempsEtudie,
      notes,
    });

    // Mise à jour des statistiques de l'utilisateur
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    user.studyStats.totalStudyTime += tempsEtudie;
    user.studyStats.lastStudyDate = new Date();

    if (subjectName) {
      const masteryIndex = user.studyStats.subjectMastery.findIndex(m => m.subjectName === subjectName);
      const scoreGain = Math.min(5, tempsEtudie / 15);

      if (masteryIndex > -1) {
        user.studyStats.subjectMastery[masteryIndex].score = Math.min(100, user.studyStats.subjectMastery[masteryIndex].score + scoreGain);
        user.studyStats.subjectMastery[masteryIndex].lastStudied = new Date();
      } else {
        user.studyStats.subjectMastery.push({
          subjectName,
          score: scoreGain,
          lastStudied: new Date()
        });
      }
    }
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Progression enregistrée avec succès. 📚',
      data: progress
    });
  } catch (error: any) {
    next(new AppError(`Erreur lors de l'enregistrement de la progression: ${error.message}`, 400));
  }
};

export const getProgressSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError('Utilisateur non trouvé', 404));
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

        res.json({
            success: true,
            data: {
                totalStudyTime: user.studyStats.totalStudyTime,
                subjectMastery: user.studyStats.subjectMastery,
                historyStats: stats[0] || { totalSessions: 0, totalTemps: 0, count: 0 }
            }
        });
    } catch (error: any) {
        next(new AppError(`Erreur lors de la récupération du résumé de progression: ${error.message}`, 500));
    }
};