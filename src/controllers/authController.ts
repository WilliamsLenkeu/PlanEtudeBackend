import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.model';
import RefreshTokenModel from '../models/RefreshToken.model';
import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, gender } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new AppError('L\'utilisateur existe déjà', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
      refreshToken: await createRefreshToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
        refreshToken: await createRefreshToken(user.id),
      });
    } else {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Token Google manquant" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: "Token Google invalide" });
    }

    const { email, name, sub, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email non fourni par Google" });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Si l'utilisateur existe déjà, on lie le compte Google si ce n'est pas fait
      if (!user.googleId) {
        user.googleId = sub;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      // Création d'un nouvel utilisateur via Google
      user = await User.create({
        email,
        name: name || 'Utilisateur Google',
        googleId: sub,
        avatar: picture,
        preferences: { themes: [], matieres: [] }
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user.id),
      refreshToken: await createRefreshToken(user.id),
    });

  } catch (error: any) {
    console.error("Erreur Google Auth:", error);
    res.status(500).json({ message: "Erreur lors de l'authentification Google" });
  }
};

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

async function createRefreshToken(userId: string) {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await RefreshTokenModel.create({ userId, token, expiresAt });
  return token;
}

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token manquant' });

  try {
    const doc = await RefreshTokenModel.findOne({ token });
    if (!doc) return res.status(401).json({ message: 'Refresh token invalide' });
    if (doc.expiresAt < new Date()) {
      await doc.deleteOne();
      return res.status(401).json({ message: 'Refresh token expiré' });
    }

    const userId = doc.userId.toString();
    const newAccess = generateToken(userId);
    const newRefresh = await createRefreshToken(userId);

    // remove old token
    await doc.deleteOne();

    res.json({ token: newAccess, refreshToken: newRefresh });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};