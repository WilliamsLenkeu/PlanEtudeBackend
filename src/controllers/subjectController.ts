import { Request, Response } from 'express';
import Subject from '../models/Subject.model';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Récupérer toutes les matières de l'utilisateur
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id }).sort({ name: 1 });
    res.json(subjects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Créer une nouvelle matière
// @route   POST /api/subjects
// @access  Private
export const createSubject = async (req: AuthRequest, res: Response) => {
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

    res.status(201).json(subject);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Vous avez déjà une matière avec ce nom 🌸' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Mettre à jour une matière
// @route   PUT /api/subjects/:id
// @access  Private
export const updateSubject = async (req: AuthRequest, res: Response) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, userId: req.user.id });

    if (!subject) {
      return res.status(404).json({ message: 'Matière non trouvée ✨' });
    }

    const { name, color, icon, difficulty, goalHoursPerWeek } = req.body;
    
    subject.name = name || subject.name;
    subject.color = color || subject.color;
    subject.icon = icon || subject.icon;
    subject.difficulty = difficulty !== undefined ? difficulty : subject.difficulty;
    subject.goalHoursPerWeek = goalHoursPerWeek !== undefined ? goalHoursPerWeek : subject.goalHoursPerWeek;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Supprimer une matière
// @route   DELETE /api/subjects/:id
// @access  Private
export const deleteSubject = async (req: AuthRequest, res: Response) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!subject) {
      return res.status(404).json({ message: 'Matière non trouvée ✨' });
    }

    res.json({ message: 'Matière supprimée avec succès 🎀' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
