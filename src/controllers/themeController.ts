import { Request, Response, NextFunction } from 'express';
import Theme from '../models/Theme.model';
import User from '../models/User.model';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Récupérer tous les thèmes disponibles
// @route   GET /api/themes
// @access  Private
export const getThemes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const themes = await Theme.find();
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }

    // Tous les thèmes sont désormais gratuits et débloqués par défaut
    const themesWithStatus = themes.map(theme => ({
      ...theme.toObject(),
      isUnlocked: true,
      isCurrent: user.preferences.currentTheme === theme.key
    }));

    res.json({
      success: true,
      data: themesWithStatus
    });
  } catch (error: any) {
    next(new AppError(`Erreur lors de la récupération des thèmes: ${error.message}`, 500));
  }
};

// @desc    Changer le thème actuel (Gratuit pour tous)
// @route   PUT /api/themes/set/:key
// @access  Private
export const setCurrentTheme = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;
    const user = await User.findById(req.user.id);
    const theme = await Theme.findOne({ key });

    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }
    
    if (!theme) {
      return next(new AppError('Thème non trouvé - La clé fournie est incorrecte', 404));
    }

    // Plus besoin de vérifier unlockedThemes car tout est gratuit
    user.preferences.currentTheme = key;
    await user.save();

    res.json({
      success: true,
      message: 'Thème mis à jour avec succès ! 🌸',
      data: {
        currentTheme: user.preferences.currentTheme,
        themeConfig: theme.config
      }
    });
  } catch (error: any) {
    next(new AppError(`Erreur lors du changement de thème: ${error.message}`, 500));
  }
};
