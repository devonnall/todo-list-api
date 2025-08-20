import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { router } from './routes/index.js';
import { errorHandler } from './middleware/error.js';

export const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(rateLimit({ windowMs: 60_000, limit: 100 }));

    app.use('/api', router);
    app.use(errorHandler);

    return app;
}