import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { specs, swaggerCustomOptions } from './utils/swagger';
import swaggerUi from 'swagger-ui-express';
import { notFound, errorHandler } from './middleware/errorHandler';
import { requestLogger } from './core/logging/Logger';
import { configureContainer } from './core/container/config';
import { createAuthModule } from './modules/auth/index';
import { createPlanningModule } from './modules/planning/index';
import { createProgressModule } from './modules/progress/index';
import { createSubjectModule } from './modules/subjects/index';
import { createThemeModule } from './modules/themes/index';
import { createLoFiModule } from './modules/lofi/index';
import { createAdminModule } from './modules/admin/index';

const app = express();

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuration pour les proxies (nécessaire pour Koyeb, Heroku, etc.)
app.set('trust proxy', 1);

// Configuration du container de dépendances
configureContainer();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com/lucide@latest"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.min.css"],
    },
  },
}));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(requestLogger); // Logger de requêtes

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerCustomOptions));

// Endpoint pour récupérer le JSON Swagger (utile pour les outils d'export PDF)
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  validate: { trustProxy: false }, // Désactive la validation stricte pour éviter le crash au démarrage
});
app.use(limiter);

// Routes - Nouvelle architecture modulaire
app.use('/api/auth', createAuthModule());
app.use('/api/planning', createPlanningModule());
app.use('/api/progress', createProgressModule());
app.use('/api/subjects', createSubjectModule());
app.use('/api/themes', createThemeModule());
app.use('/api/lofi', createLoFiModule());
app.use('/api/admin', createAdminModule());

// TODO: Implémenter les autres modules
// app.use('/api/progress', createProgressModule());
// app.use('/api/users', createUserModule()); // Routes utilisateur générales
// app.use('/api/stats', createStatsModule());
// app.use('/api/subjects', createSubjectModule());
// app.use('/api/themes', createThemeModule());
// app.use('/api/lofi', createLofiModule());
// app.use('/api/admin', createAdminModule());

app.get('/', (req, res) => {
  res.send('API PlanÉtude is running...');
});

app.use(notFound);
app.use(errorHandler);

export default app;