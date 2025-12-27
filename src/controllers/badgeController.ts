import { Request, Response } from 'express';
import Badge from '../models/Badge.model';

interface AuthRequest extends Request { user?: any }

export const awardBadge = async (req: AuthRequest, res: Response) => {
  try {
    const { key, name, description } = req.body;
    const badge = await Badge.create({ userId: req.user.id, key, name, description });
    res.status(201).json(badge);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getBadges = async (req: AuthRequest, res: Response) => {
  try {
    const badges = await Badge.find({ userId: req.user.id }).sort({ awardedAt: -1 });
    res.json(badges);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
