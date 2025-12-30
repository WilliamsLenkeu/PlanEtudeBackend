import mongoose, { Document, Schema } from 'mongoose';

export interface ILofiTrack extends Document {
  title: string;
  artist: string;
  url: string; // URL de streaming (ex: YouTube, SoundCloud, ou fichier direct)
  thumbnail: string;
  category: 'relax' | 'focus' | 'sleep';
}

const LofiTrackSchema: Schema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  url: { type: String, required: true },
  thumbnail: { type: String },
  category: { type: String, enum: ['relax', 'focus', 'sleep'], default: 'focus' },
}, { timestamps: true });

export default mongoose.model<ILofiTrack>('LofiTrack', LofiTrackSchema);
