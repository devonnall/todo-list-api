import { Router } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const docsRouter = Router();

const spec = swaggerJsdoc({
    definition: {
        openapi: '3.1.0',
        info: { title: 'Todo API', version: '1.0.0' }
    },
    apis: ['src/routes/**/*.ts']
});

docsRouter.use('/', swaggerUi.serve, swaggerUi.setup(spec));