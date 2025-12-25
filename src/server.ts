import app from './app';
import connectDB from './config/db';
import { validateEnv, config } from './config/env';

// Vérifier les variables d'environnement avant de démarrer
validateEnv();

const PORT = config.port;

// Connect to Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});