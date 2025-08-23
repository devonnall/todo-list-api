import { createApp } from './app.js';
import { env } from './shared/config/env.js';
import { logger } from './shared/libs/logger.js';

const app = createApp();
app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, `Server listening on port localhost:${env.PORT}`);
})