import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not defined in .env");
  // On ne quitte pas forcément, on peut juste logger, mais pour le core feature c'est critique.
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default genAI;