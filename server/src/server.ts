import { createApp } from './app.js';
import { env } from './shared/config/env.js';
import { logger } from './shared/libs/logger.js';

const app = createApp();
const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, `Server listening on http://localhost:${env.PORT}`);
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
server.on('error', (err) => {
  logger.error({ err }, 'server error');
  process.exit(1);
});
