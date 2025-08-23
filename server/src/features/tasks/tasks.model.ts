import { z } from 'zod';
import { TaskStatus, Priority } from '@prisma/client';

export const CreateBody = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(10_000).optional(),
    status: z.enum(TaskStatus).optional(),
    dueDate: z.coerce.date().optional(),
    priority: z.enum(Priority).optional(),
});
export const UpdateBody = CreateBody.partial();

export const PaginationQuery = z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).catch(20),
    q: z.string().trim().min(1).max(200).optional(),
    status: z.enum(TaskStatus).optional(),
    priority: z.enum(Priority).optional(),
});

export const taskSelect = {
    id: true, title: true, description: true, status: true, dueDate: true, 
    priority: true, createdAt: true, updatedAt: true,
};