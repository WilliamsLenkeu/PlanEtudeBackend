import { Request, Response } from 'express';
import User from '../models/User.model';
import Theme from '../models/Theme.model';
import bcrypt from 'bcryptjs';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Récupérer le profil utilisateur avec détails du thème
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Récupérer la config complète du thème actuel
    const theme = await Theme.findOne({ key: user.preferences.currentTheme });

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        themeConfig: theme ? theme.config : null
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Mise à jour sécurisée des champs autorisés
    if (req.body.name) user.name = req.body.name;
    if (req.body.gender) user.gender = req.body.gender;
    if (req.body.avatar) user.avatar = req.body.avatar;
    
    // Gestion des préférences (matieres)
    if (req.body.preferences?.matieres) {
      user.preferences.matieres = req.body.preferences.matieres;
    }

    // Si l'email change, vérifier s'il est déjà pris
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé 🌸' });
      }
      user.email = req.body.email;
    }

    const updatedUser = await user.save();
    
    // On renvoie le profil complet sans le mot de passe
    const theme = await Theme.findOne({ key: updatedUser.preferences.currentTheme });

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès ! ✨',
      data: {
        ...updatedUser.toObject(),
        themeConfig: theme ? theme.config : null
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Changer le mot de passe
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !user.password) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'L\'ancien mot de passe est incorrect 🎀' });
    }

    // Crypter le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès ! 🍭'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};