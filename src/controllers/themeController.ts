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

    // On rajoute l'information "débloqué" pour chaque thème
    const themesWithStatus = themes.map(theme => ({
      ...theme.toObject(),
      isUnlocked: user.preferences.unlockedThemes.includes(theme.key),
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

// @desc    Acheter/Débloquer un thème avec de l'XP
// @route   POST /api/themes/unlock/:key
// @access  Private
export const unlockTheme = async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;
    const user = await User.findById(req.user.id);
    const theme = await Theme.findOne({ key });

    if (!user || !theme) {
      return res.status(404).json({ success: false, message: 'Utilisateur ou Thème non trouvé ✨' });
    }

    if (user.preferences.unlockedThemes.includes(key)) {
      return res.status(400).json({ success: false, message: 'Tu as déjà débloqué ce thème ! 🎀' });
    }

    if (user.gamification.xp < theme.priceXP) {
      return res.status(400).json({ 
        success: false, 
        message: `Il te manque ${theme.priceXP - user.gamification.xp} XP pour ce thème ! ✨` 
      });
    }

    user.gamification.xp -= theme.priceXP;
    // On stocke la clé du thème (ex: 'strawberry-milk')
    user.preferences.unlockedThemes.push(theme.key);
    
    await user.save();

    res.json({
      success: true,
      message: `Bravo ! Tu as débloqué le thème ${theme.name} ! 🍭`,
      data: {
        unlockedThemes: user.preferences.unlockedThemes,
        remainingXP: user.gamification.xp,
        themeConfig: theme.config // On renvoie la config pour l'appliquer direct si besoin
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Changer le thème actuel
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

    if (!user.preferences.unlockedThemes.includes(key)) {
      return res.status(400).json({ success: false, message: 'Tu dois d\'abord débloquer ce thème ! 🎀' });
    }

    user.preferences.currentTheme = key;
    await user.save();

    res.json({
      success: true,
      message: 'Thème mis à jour ! 🌸',
      data: {
        currentTheme: user.preferences.currentTheme,
        themeConfig: theme.config // ESSENTIEL : On renvoie les variables CSS/Couleurs ici
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
