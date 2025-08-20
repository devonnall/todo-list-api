import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { CreateUserBody } from '../models/users.model.js';
import { postUser } from '../controllers/users.controller.js';

export const usersRouter = Router();
usersRouter.post('/', validate(CreateUserBody), postUser);
