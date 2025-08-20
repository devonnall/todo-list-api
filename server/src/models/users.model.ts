import { z } from 'zod';

export const UserBody = z.object({
    email: z.email(),
    name: z.string(),
});

export type UserBody = z.infer<typeof UserBody>;