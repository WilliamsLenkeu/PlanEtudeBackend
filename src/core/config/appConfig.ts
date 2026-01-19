import dotenv from 'dotenv';
import { AppConfig } from '../../shared/types';

// Charger les variables d'environnement
dotenv.config();

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '30d',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://williams:ZtIWddfKAd8Je83I@mydatabase.cl3xiio.mongodb.net/?appName=MyDatabase',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'planetude',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  mistralApiKey: process.env.MISTRAL_API_KEY || '',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
};

export const validateEnv = (): void => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'MONGODB_URI',
    'GOOGLE_CLIENT_ID',
    'GEMINI_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missingVars.join(', ')}\n` +
      'Vérifiez votre fichier .env'
    );
  }

  // Validation des valeurs
  if (config.port < 1 || config.port > 65535) {
    throw new Error('PORT doit être entre 1 et 65535');
  }

  if (!['development', 'production', 'test'].includes(config.nodeEnv)) {
    throw new Error('NODE_ENV doit être development, production ou test');
  }

  console.log('✅ Configuration validée');
};