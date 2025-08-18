import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { CreateUserBody } from './users.schema.js';
import { postUser } from './users.controller.js';

export const usersRouter = Router();
usersRouter.post('/', validate(CreateUserBody), postUser);
