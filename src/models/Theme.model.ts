import mongoose, { Document, Schema } from 'mongoose';

export interface ITheme extends Document {
  key: string; // ex: 'strawberry-milk'
  name: string; // ex: 'Lait Fraise 🍓'
  description: string;
  priceXP: number;
  isPremium: boolean;
  config: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    accentColor: string;
    textColor: string;
    fontFamily: string;
    borderRadius: string;
    cardShadow: string;
  };
}

const ThemeSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  priceXP: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  config: {
    primaryColor: { type: String, default: '#FFB6C1' },
    secondaryColor: { type: String, default: '#FFD1DC' },
    backgroundColor: { type: String, default: '#FFF0F5' },
    accentColor: { type: String, default: '#FF69B4' },
    textColor: { type: String, default: '#4A4A4A' },
    fontFamily: { type: String, default: "'Quicksand', sans-serif" },
    borderRadius: { type: String, default: '20px' },
    cardShadow: { type: String, default: '0 8px 15px rgba(255, 182, 193, 0.2)' },
  },
}, { timestamps: true });

export default mongoose.model<ITheme>('Theme', ThemeSchema);
