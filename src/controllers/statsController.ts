import { Request, Response } from 'express';
import Progress from '../models/Progress.model';
import Planning from '../models/Planning.model';
import User from '../models/User.model';
import Subject from '../models/Subject.model';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Récupérer les recommandations d'étude intelligentes
// @route   GET /api/stats/recommendations
// @access  Private
export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // 1. Récupérer les matières de l'utilisateur
    const subjects = await Subject.find({ userId });
    
    // 2. Récupérer le temps d'étude par matière cette semaine
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const studyStats = await Planning.aggregate([
      { $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startOfWeek }
      } },
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
      }
    ]);

    const statsMap = new Map(studyStats.map(s => [s._id, s.totalMinutes]));

    // 3. Analyser et générer des conseils
    const recommendations = subjects.map(sub => {
      const minutesDone = statsMap.get(sub.name) || 0;
      const targetMinutes = (sub.goalHoursPerWeek || 0) * 60;
      const progress = targetMinutes > 0 ? (minutesDone / targetMinutes) * 100 : 0;

      let advice = "";
      let priority = "low";

      if (progress < 20 && targetMinutes > 0) {
        advice = `Tu as un peu délaissé les ${sub.name} cette semaine. Une petite session de 20 min ? 🌸`;
        priority = "high";
      } else if (progress < 50) {
        advice = `C'est bien parti pour les ${sub.name} ! Continue comme ça pour atteindre ton objectif. ✨`;
        priority = "medium";
      } else if (progress >= 100) {
        advice = `Objectif atteint pour les ${sub.name} ! Tu es incroyable. 🏆`;
        priority = "none";
      } else {
        advice = `Encore un petit effort en ${sub.name} et tu seras au top ! 🍭`;
        priority = "low";
      }

      return {
        subject: sub.name,
        progress: Math.round(progress),
        advice,
        priority
      };
    });

    // Trier par priorité
    const sortedRecommendations = recommendations
      .filter(r => r.priority !== "none")
      .sort((a, b) => {
        const order: any = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      });

    res.json({
      success: true,
      data: sortedRecommendations.slice(0, 3) // Top 3 conseils
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Récupérer les données pour le heatmap (6 derniers mois)
// @route   GET /api/stats/heatmap
// @access  Private
export const getHeatmapData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const heatmapData = await Planning.aggregate([
      { $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sixMonthsAgo }
      } },
      { $unwind: '$sessions' },
      { $match: { 'sessions.statut': 'termine' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$sessions.fin" } },
          minutes: {
            $sum: {
              $divide: [
                { $subtract: ['$sessions.fin', '$sessions.debut'] },
                1000 * 60
              ]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      success: true,
      data: heatmapData
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Générer un rapport de productivité hebdomadaire
// @route   GET /api/stats/weekly-report
// @access  Private
export const getWeeklyReport = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 7);

    // 1. Temps total par jour sur les 7 derniers jours
    const dailyStats = await Planning.aggregate([
      { $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startOfWeek }
      } },
      { $unwind: '$sessions' },
      { $match: { 'sessions.statut': 'termine' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$sessions.fin" } },
          minutes: {
            $sum: {
              $divide: [
                { $subtract: ['$sessions.fin', '$sessions.debut'] },
                1000 * 60
              ]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 2. Analyse IA du rapport
    const totalMinutes = dailyStats.reduce((acc, curr) => acc + curr.minutes, 0);
    const avgMinutesPerDay = totalMinutes / 7;
    
    let evaluation = "";
    let emoji = "🌸";

    if (totalMinutes > 600) {
      evaluation = "Une semaine absolument incroyable ! Tu as été d'une productivité exemplaire.";
      emoji = "👑";
    } else if (totalMinutes > 300) {
      evaluation = "Bonne semaine ! Tu as maintenu un rythme régulier et efficace.";
      emoji = "✨";
    } else {
      evaluation = "Une semaine un peu plus calme. C'est important de se reposer aussi, prête pour la semaine prochaine ?";
      emoji = "🧸";
    }

    res.json({
      success: true,
      data: {
        period: "7 derniers jours",
        totalMinutes: Math.round(totalMinutes),
        avgMinutesPerDay: Math.round(avgMinutesPerDay),
        dailyBreakdown: dailyStats,
        aiEvaluation: {
          text: evaluation,
          emoji: emoji
        }
      }
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // 1. Calcul du temps total et moyenne de session via les sessions terminées
    const statsAggregation = await Planning.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$sessions' },
      { $match: { 'sessions.statut': 'termine' } },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$sessions.fin', '$sessions.debut'] },
              1000 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalTime: { $sum: '$duration' },
          avgTime: { $avg: '$duration' }
        }
      }
    ]);

    // 2. Matière la plus étudiée
    const subjectStats = await Planning.aggregate([
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
      { $sort: { totalMinutes: -1 } },
      { $limit: 1 }
    ]);

    const totalTime = statsAggregation[0]?.totalTime || 0;
    const avgTime = statsAggregation[0]?.avgTime || 0;
    const mostStudied = subjectStats[0]?._id || "Aucune matière";

    res.json({
      success: true,
      data: {
        totalStudyTime: Math.round(totalTime),
        averageSessionDuration: Math.round(avgTime),
        mostStudiedSubject: mostStudied,
        streakDays: user.gamification?.streak || 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubjectStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Agrégation pour le temps par matière avec récupération de la couleur réelle
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
      {
        $lookup: {
          from: 'subjects',
          let: { subjectName: '$_id' },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $and: [
                    { $eq: ['$name', '$$subjectName'] },
                    { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: 'subjectInfo'
        }
      },
      { $unwind: { path: '$subjectInfo', preserveNullAndEmptyArrays: true } },
      { $sort: { totalMinutes: -1 } }
    ]);

    res.json({
      success: true,
      data: timeBySubject.map(s => ({
        subject: s._id,
        minutes: Math.round(s.totalMinutes),
        color: s.subjectInfo?.color || "#FFB6C1" // Fallback rose si la matière n'existe plus
      }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
