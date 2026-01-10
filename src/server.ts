import http from 'http';
import app from './app';
import connectDB from './config/db';
import { validateEnv, config } from './config/env';
import { initSocket } from './utils/socket';

// Vérifier les variables d'environnement avant de démarrer
validateEnv();

const PORT = config.port;

// Connect to Database
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});