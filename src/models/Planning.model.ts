import mongoose, { Document, Schema } from 'mongoose';

export interface IPlanning extends Document {
  userId: mongoose.Types.ObjectId;
  periode: 'jour' | 'semaine' | 'mois' | 'semestre';
  dateDebut: Date;
  sessions: {
    matiere: string;
    debut: Date;
    fin: Date;
    statut: 'planifie' | 'en_cours' | 'termine' | 'rate';
    type: 'LEARNING' | 'REVIEW' | 'PRACTICE' | 'MOCK_EXAM' | 'BUFFER' | 'PAUSE';
    method: 'POMODORO' | 'DEEP_WORK' | 'CLASSIC';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    completedPomodoros?: number;
    totalPomodoros?: number;
    notes?: string;
  }[];
  createdAt: Date;
}

const PlanningSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  periode: { type: String, enum: ['jour', 'semaine', 'mois', 'semestre'], required: true },
  dateDebut: { type: Date, required: true, index: true },
  sessions: [{
    matiere: { type: String, required: true },
    debut: { type: Date, required: true },
    fin: { type: Date, required: true },
    statut: { type: String, enum: ['planifie', 'en_cours', 'termine', 'rate'], default: 'planifie' },
    type: { 
      type: String, 
      enum: ['LEARNING', 'REVIEW', 'PRACTICE', 'MOCK_EXAM', 'BUFFER', 'PAUSE'], 
      default: 'LEARNING' 
    },
    method: { 
      type: String, 
      enum: ['POMODORO', 'DEEP_WORK', 'CLASSIC'], 
      default: 'CLASSIC' 
    },
    priority: { 
      type: String, 
      enum: ['LOW', 'MEDIUM', 'HIGH'], 
      default: 'MEDIUM' 
    },
    completedPomodoros: { type: Number, default: 0 },
    totalPomodoros: { type: Number, default: 0 },
    notes: { type: String }
  }],
}, { timestamps: true });

PlanningSchema.index({ userId: 1, dateDebut: -1 });

export default mongoose.model<IPlanning>('Planning', PlanningSchema);