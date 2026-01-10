import { Request, Response, NextFunction } from 'express';
import Subject from '../models/Subject.model';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Récupérer toutes les matières de l'utilisateur
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id }).sort({ name: 1 });
    res.json({ success: true, data: subjects });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la récupération des matières: ${error.message}`, 500));
  }
};

// @desc    Créer une nouvelle matière
// @route   POST /api/subjects
// @access  Private
export const createSubject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, color, icon, difficulty, goalHoursPerWeek } = req.body;
    
    const subject = await Subject.create({
      userId: req.user.id,
      name,
      color,
      icon,
      difficulty,
      goalHoursPerWeek
    });

    res.status(201).json({ success: true, data: subject });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new AppError('Vous avez déjà une matière avec ce nom 🌸', 400));
    }
    next(new AppError(`Erreur lors de la création de la matière: ${error.message}`, 400));
  }
};

// @desc    Mettre à jour une matière
// @route   PUT /api/subjects/:id
// @access  Private
export const updateSubject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!subject) {
      return next(new AppError('Matière non trouvée ✨', 404));
    }

    const { name, color, icon, difficulty, goalHoursPerWeek } = req.body;
    
    subject.name = name || subject.name;
    subject.color = color || subject.color;
    subject.icon = icon || subject.icon;
    subject.difficulty = difficulty !== undefined ? difficulty : subject.difficulty;
    subject.goalHoursPerWeek = goalHoursPerWeek !== undefined ? goalHoursPerWeek : subject.goalHoursPerWeek;

    const updatedSubject = await subject.save();
    res.json({ success: true, data: updatedSubject });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la mise à jour de la matière: ${error.message}`, 400));
  }
};

// @desc    Supprimer une matière
// @route   DELETE /api/subjects/:id
// @access  Private
export const deleteSubject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!subject) {
      return next(new AppError('Matière non trouvée ✨', 404));
    }

    res.json({ success: true, message: 'Matière supprimée avec succès 🎀' });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la suppression de la matière: ${error.message}`, 500));
  }
};
