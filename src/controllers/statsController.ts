import { Request, Response } from 'express';
import Progress from '../models/Progress.model';
import Planning from '../models/Planning.model';
import User from '../models/User.model';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}

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
