import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  name: string;
  gender: 'M' | 'F' | 'Autre';
  preferences: {
    themes: string[];
    matieres: string[];
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
    themes: [String],
    matieres: [String],
  },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);