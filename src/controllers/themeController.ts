import { Request, Response } from 'express';
import Theme from '../models/Theme.model';
import User from '../models/User.model';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Récupérer tous les thèmes disponibles
// @route   GET /api/themes
// @access  Private
export const getThemes = async (req: AuthRequest, res: Response) => {
  try {
    const themes = await Theme.find();
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé ✨' });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Changer le thème actuel (Gratuit pour tous)
// @route   PUT /api/themes/set/:key
// @access  Private
export const setCurrentTheme = async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;
    const user = await User.findById(req.user.id);
    const theme = await Theme.findOne({ key });

    if (!user || !theme) {
      return res.status(404).json({ success: false, message: 'Utilisateur ou Thème non trouvé ✨' });
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
    res.status(500).json({ success: false, message: error.message });
  }
};
