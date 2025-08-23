import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware';
import * as ctrl from './tasks.controller';

const tasksRoutes = Router();
tasksRoutes.use(requireAuth);

tasksRoutes.get('/', ctrl.listMyTasks);
tasksRoutes.post('/', ctrl.createTask);
tasksRoutes.get('/:id', ctrl.getMyTask);
tasksRoutes.patch('/:id', ctrl.updateMyTask);
tasksRoutes.delete('/:id', ctrl.deleteMyTask);

export default tasksRoutes;