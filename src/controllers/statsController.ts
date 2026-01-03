import { Request, Response } from 'express';
import Planning from '../models/Planning.model';
import User from '../models/User.model';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}

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
          dateDebut: { $gte: sixMonthsAgo }
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
