import { Request, Response } from 'express';
import { prisma } from '../../shared/db/prisma';
import { CreateBody, UpdateBody, PaginationQuery, taskSelect } from './tasks.model';

export async function createTask(req: Request, res: Response) {
    const body = CreateBody.parse(req.body);
    const task = await prisma.task.create({
        data: { ...body, userId: req.user!.id },
        select: taskSelect,
    });
    res.status(201).json(task);
}

export async function listMyTasks(req: Request, res: Response) {
    const items = await prisma.task.findMany({
        where: {
            userId: req.user!.id,
        },
        orderBy: { createdAt: 'desc' },
        select: taskSelect,
    });
    res.json({ items });
}

export async function searchMyTasks(req: Request, res: Response) {
    const { cursor, limit, q, status, priority } = PaginationQuery.parse(req.query);

    const items = await prisma.task.findMany({
        where: {
            userId: req.user!.id,
            AND: [
                q ? { title: { contains: q, mode: 'insensitive' }} : {},
                status ? { status } : {},
                priority ? { priority } : {},
            ]
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: 'desc' },
        select: taskSelect,
    })

    const nextCursor = items.length > limit ? items.pop()!.id : null;
    res.json({ items, nextCursor });
}

export async function getMyTask(req: Request, res: Response) {
    const task = await prisma.task.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
        select: taskSelect,
    });
    if (!task) return res.status(404).json({ error: 'not_found' });
    res.json(task);
}

export async function updateMyTask(req: Request, res: Response) {
    const body = UpdateBody.parse(req.body);
    const existing = await prisma.task.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
        select: { id: true },
    });
    if (!existing) return res.status(404).json({ error: 'not_found' });

    const task = await prisma.task.update({
        where: { id: existing.id },
        data: body,
        select: taskSelect,
    });
    res.json(task);
}

export async function deleteMyTask(req: Request, res: Response) {
    const existing = await prisma.task.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
        select: { id: true },
    });
    if (!existing) return res.status(404).json({ error: 'not_found' });

    await prisma.task.delete({ where: { id: existing.id } });
    res.status(204).end();
}