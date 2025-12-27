import mongoose, { Schema } from 'mongoose';

const BadgeSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  awardedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Badge', BadgeSchema);
