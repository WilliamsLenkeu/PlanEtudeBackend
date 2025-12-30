import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import planningRoutes from './routes/planning.routes';
import progressRoutes from './routes/progress.routes';
import userRoutes from './routes/user.routes';
import statsRoutes from './routes/stats.routes';
import reminderRoutes from './routes/reminder.routes';
import badgeRoutes from './routes/badge.routes';
import subjectRoutes from './routes/subject.routes';
import themeRoutes from './routes/theme.routes';
import lofiRoutes from './routes/lofi.routes';
import adminRoutes from './routes/admin.routes';
import { specs, swaggerCustomOptions } from './utils/swagger';
import swaggerUi from 'swagger-ui-express';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();

// Configuration pour les proxies (nécessaire pour Koyeb, Heroku, etc.)
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(cors());
app.use(express.json());

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/lofi', lofiRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API PlanÉtude is running...');
});

app.use(notFound);
app.use(errorHandler);

export default app;