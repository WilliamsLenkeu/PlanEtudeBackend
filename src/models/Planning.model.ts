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
    notes?: string;
  }[];
  createdAt: Date;
}

const PlanningSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  periode: { type: String, enum: ['jour', 'semaine', 'mois', 'semestre'], required: true },
  dateDebut: { type: Date, required: true },
  sessions: [{
    matiere: { type: String, required: true },
    debut: { type: Date, required: true },
    fin: { type: Date, required: true },
    statut: { type: String, enum: ['planifie', 'en_cours', 'termine', 'rate'], default: 'planifie' },
    notes: { type: String }
  }],
}, { timestamps: true });

export default mongoose.model<IPlanning>('Planning', PlanningSchema);