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
  },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);