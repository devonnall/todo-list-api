import { Router } from 'express';
import { requireAuth, requireRole } from '../../shared/middleware/auth.middleware';
import * as ctrl from './users.controller';

const usersRoutes = Router();

usersRoutes.get('/me', requireAuth, ctrl.getMe);
usersRoutes.patch('/me', requireAuth, ctrl.updateMe);

usersRoutes.get('/', requireAuth, requireRole('admin'), ctrl.listUsers);
usersRoutes.get('/:id', requireAuth, ctrl.getUserById);
usersRoutes.patch(':id', requireAuth, ctrl.updateUserById);
usersRoutes.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteUserById);

export default usersRoutes;