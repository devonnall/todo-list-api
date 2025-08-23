import { Request, Response } from 'express';
import { prisma } from '../../shared/db/prisma';
import { UpdateMeBody, UpdateUserBody, PaginationQuery } from './users.model';
import { Role } from '@prisma/client';

function isSelfOrAdmin(req: Request, userId: string) {
    return req.user?.id === userId || req.user?.role === 'admin';
}

const baseSelect = {
    id: true,
    email: true,
    displayName: true,
    photoURL: true,
    emailVerified: true,
    role: true,
    createdAt: true,
}

export async function getMe(req: Request, res: Response) {
    const me = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: baseSelect,
    });
    if (!me) return res.status(404).json({ error: 'not_found'});
    res.json(me);
}

export async function updateMe(req: Request, res: Response) {
    const body = UpdateMeBody.parse(req.body);
    const me = await prisma.user.update({
        where: { id: req.user!.id },
        data: body,
        select: baseSelect,
    });
    res.json(me);
}

export async function listUsers(req: Request, res: Response) {
    const { cursor, limit, q, role } = PaginationQuery.parse(req.query);
    const roleString: string = role as string;
    const roleEnum: Role = roleString as Role;

    const users = await prisma.user.findMany({
        where: {
            AND: [
                q ? {
                    OR: [
                        { email: { contains: q, mode: 'insensitive' }},
                        { displayName: { contains: q, mode: 'insensitive' }},
                    ]
                } : {},
                role ? { role: roleEnum } : {},
            ],
        },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        orderBy: { createdAt: 'desc' },
        select: baseSelect,
    });

    const nextCursor = users.length > limit ? users.pop()!.id : null;
    res.json({ items: users, nextCursor });
}

export async function getUserById(req: Request, res: Response) {
    const { id } = req.params;
    if (!isSelfOrAdmin(req, id)) return res.status(403).json({ error: 'forbidden' });

    const user = await prisma.user.findUnique({ where: { id }, select: baseSelect });
    if (!user) return res.status(404).json({ error: 'not_found' });
    res.json(user);
}

export async function updateUserById(req: Request, res: Response) {
    const { id } = req.params;
    const body = UpdateUserBody.parse(req.body);

    if (req.user?.role !== 'admin') {
        if (req.user?.id !== id) return res.status(403).json({ error: 'forbidden' });
        const selfBody = UpdateMeBody.parse(body);
        const updated = await prisma.user.update({ where: { id }, data: selfBody, select: baseSelect })
        return res.json(updated);
    }

    const updated = await prisma.user.update({ where: { id }, data: body, select: baseSelect });
    res.json(updated);
}

export async function deleteUserById(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
}
