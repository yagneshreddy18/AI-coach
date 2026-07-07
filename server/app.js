import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import env from './src/config/env.js';

// Route imports
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import dsaRoutes from './src/routes/dsa.routes.js';
import fullstackRoutes from './src/routes/fullstack.routes.js';
import aptitudeRoutes from './src/routes/aptitude.routes.js';
import projectRoutes from './src/routes/project.routes.js';
import timerRoutes from './src/routes/timer.routes.js';
import goalsRoutes from './src/routes/goals.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import calendarRoutes from './src/routes/calendar.routes.js';
import searchRoutes from './src/routes/search.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';
import revisionRoutes from './src/routes/revision.routes.js';

// Middleware imports
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

const app = express();

// Security & utility middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/fullstack', fullstackRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/revisions', revisionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
