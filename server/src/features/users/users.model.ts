import { z } from 'zod';
import { Role } from '@prisma/client';

const UpdateMeBody = z.object({
    displayName: z.string().min(1).max(120).optional(),
    photoURL: z.url().optional(),
});

const UpdateUserBody = UpdateMeBody.extend({
    role: z.enum(Role).optional(),
    disabled: z.boolean().optional(),
});

const PaginationQuery = z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().min(1).max(200).optional(),
    role: z.string().optional(),
})

export {
    UpdateMeBody,
    UpdateUserBody,
    PaginationQuery,
}