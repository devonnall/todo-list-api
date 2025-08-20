import { Request, Response } from 'express';
import { createUser } from '../services/users.service.js';
import type { CreateUserBody } from '../models/users.model.js';

export const postUser = async (req: Request<{}, {}, CreateUserBody>, res: Response) => {
  const { email, name } = req.body;
  const user = await createUser(email, name);
  res.status(201).json(user);
};