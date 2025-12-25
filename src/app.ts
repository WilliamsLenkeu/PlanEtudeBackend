import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import planningRoutes from './routes/planning.routes';
import progressRoutes from './routes/progress.routes';
import userRoutes from './routes/user.routes';
import { notFound, errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/planning', planningRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API PlanÉtude is running...');
});

app.use(notFound);
app.use(errorHandler);

export default app;