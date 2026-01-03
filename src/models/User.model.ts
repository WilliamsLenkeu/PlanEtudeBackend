import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  name: string;
  gender: 'M' | 'F';
  role: 'user' | 'admin';
  preferences: {
    currentTheme: string;
    unlockedThemes: string[];
    matieres: string[];
  };
  studyStats: {
    totalStudyTime: number; // en minutes
    lastStudyDate?: Date;
    subjectMastery: Array<{
      subjectName: string;
      score: number; // 0-100
      lastStudied: Date;
    }>;
  };
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  name: { type: String, required: true },
  gender: { type: String, enum: ['M', 'F'], required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    currentTheme: { type: String, default: 'classic-pink' },
    unlockedThemes: { type: [String], default: ['classic-pink'] },
    matieres: [String],
  },
  studyStats: {
    totalStudyTime: { type: Number, default: 0 },
    lastStudyDate: { type: Date },
    subjectMastery: [{
      subjectName: String,
      score: { type: Number, default: 0 },
      lastStudied: { type: Date, default: Date.now }
    }],
  },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);