import { z } from 'zod';

export const CreateUserBody = z.object({
    email: z.email(),
    name: z.string().min(1),
});

export type CreateUserBody = z.infer<typeof CreateUserBody>;