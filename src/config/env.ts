import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
];

/**
 * Vérifie que toutes les variables d'environnement nécessaires sont présentes.
 * Utile pour éviter des erreurs silencieuses au déploiement (Koyeb, Docker, etc.)
 */
export const validateEnv = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error('❌ Erreur : Variables d\'environnement manquantes :', missing.join(', '));
    console.error('Assurez-vous de les configurer dans votre fichier .env ou sur votre plateforme de déploiement (Koyeb).');
    process.exit(1);
  }
};

export const config = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
};