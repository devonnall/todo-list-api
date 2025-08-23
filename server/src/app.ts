import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { decodeFirebaseToken } from './shared/middleware/auth.middleware.js';
import { errorHandler } from './shared/middleware/error.js';
import usersRoutes from './features/users/users.routes.js';
import tasksRoutes from './features/tasks/tasks.routes.js';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  const limiter = rateLimit({
    windowMs: 60_000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // count by user when authenticated, else IP
    keyGenerator: (req, _res) => (req as any).user?.id ?? req.ip,
    // don’t rate-limit health
    skip: (req) => req.path === '/health',
  });
  app.use(limiter);

  app.get('/health', (_req, res) => res.send('ok'));

  app.use(decodeFirebaseToken);

  app.use('/api/users', usersRoutes);
  app.use('/api/tasks', tasksRoutes);

  app.use((_req, res) => res.status(404).json({ error: 'not_found' }));

  app.use(errorHandler);

  return app;
};
