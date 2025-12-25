import { Request, Response } from 'express';
import Planning from '../models/Planning.model';

interface AuthRequest extends Request {
  user?: any;
}

export const getPlannings = async (req: AuthRequest, res: Response) => {
  try {
    const plannings = await Planning.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(plannings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPlanning = async (req: AuthRequest, res: Response) => {
  const { periode, dateDebut, sessions } = req.body;

  try {
    const planning = await Planning.create({
      userId: req.user.id,
      periode,
      dateDebut,
      sessions,
    });
    res.status(201).json(planning);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePlanning = async (req: AuthRequest, res: Response) => {
  try {
    const planning = await Planning.findById(req.params.id);

    if (!planning) {
      return res.status(404).json({ message: 'Planning non trouvé' });
    }

    if (planning.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const updatedPlanning = await Planning.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedPlanning);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlanning = async (req: AuthRequest, res: Response) => {
  try {
    const planning = await Planning.findById(req.params.id);

    if (!planning) {
      return res.status(404).json({ message: 'Planning non trouvé' });
    }

    if (planning.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    await planning.deleteOne();
    res.json({ message: 'Planning supprimé' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};