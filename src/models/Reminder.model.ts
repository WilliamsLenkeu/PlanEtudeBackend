import mongoose, { Schema } from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planningId: { type: Schema.Types.ObjectId, ref: 'Planning' },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  notified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Reminder', ReminderSchema);
