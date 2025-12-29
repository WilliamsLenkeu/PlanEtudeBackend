import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string; // Hex color
  icon?: string;
  difficulty: number; // 1 to 5
  goalHoursPerWeek?: number;
}

const SubjectSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#3498db' },
  icon: { type: String },
  difficulty: { type: Number, min: 1, max: 5, default: 3 },
  goalHoursPerWeek: { type: Number, default: 0 },
}, { timestamps: true });

// Un utilisateur ne peut pas avoir deux matières avec le même nom
SubjectSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<ISubject>('Subject', SubjectSchema);
