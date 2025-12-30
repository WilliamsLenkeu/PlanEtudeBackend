import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  name: string;
  gender: 'M' | 'F' | 'Autre';
  preferences: {
    currentTheme: string;
    unlockedThemes: string[];
    matieres: string[];
  };
  gamification: {
    totalXP: number;
    xp: number;
    level: number;
    streak: number;
    lastStudyDate?: Date;
    totalStudyTime: number; // en minutes
    notifications: Array<{
      id: string;
      type: 'badge' | 'quest' | 'level';
      message: string;
      read: boolean;
      createdAt: Date;
    }>;
    companion: {
      name: string;
      type: string; // ex: "Chat", "Lapin", "Fée"
      level: number;
      evolutionStage: number; // 1, 2, 3
      happiness: number; // 0-100
      lastFed?: Date;
    };
    subjectMastery: Array<{
      subjectName: string;
      score: number; // 0-100
      lastStudied: Date;
    }>;
    dailyQuests: Array<{
      key: string;
      title: string;
      description: string;
      xpReward: number;
      isCompleted: boolean;
      target: number;
      current: number;
    }>;
    lastQuestReset?: Date;
  };
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  name: { type: String, required: true },
  gender: { type: String, enum: ['M', 'F', 'Autre'], required: true },
  preferences: {
    currentTheme: { type: String, default: 'classic-pink' },
    unlockedThemes: { type: [String], default: ['classic-pink'] },
    matieres: [String],
  },
  gamification: {
    totalXP: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastStudyDate: { type: Date },
    totalStudyTime: { type: Number, default: 0 },
    notifications: [{
      id: String,
      type: { type: String, enum: ['badge', 'quest', 'level'] },
      message: String,
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }],
    companion: {
      name: { type: String, default: 'Yumi' },
      type: { type: String, default: 'Chat' },
      level: { type: Number, default: 1 },
      evolutionStage: { type: Number, default: 1 },
      happiness: { type: Number, default: 100 },
      lastFed: { type: Date }
    },
    subjectMastery: [{
      subjectName: String,
      score: { type: Number, default: 0 },
      lastStudied: { type: Date, default: Date.now }
    }],
    dailyQuests: [{
      key: String,
      title: String,
      description: String,
      xpReward: Number,
      isCompleted: { type: Boolean, default: false },
      target: { type: Number, default: 1 },
      current: { type: Number, default: 0 }
    }],
    lastQuestReset: { type: Date, default: Date.now }
  },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);