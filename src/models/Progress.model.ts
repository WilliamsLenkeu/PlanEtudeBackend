import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  sessionsCompletees: number;
  tempsEtudie: number; // en minutes
  notes: string;
}

const ProgressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  sessionsCompletees: { type: Number, default: 0 },
  tempsEtudie: { type: Number, default: 0 },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);