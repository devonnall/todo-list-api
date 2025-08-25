import { Request, Response, NextFunction } from 'express';
import { admin } from '../config/firebase';
import { prisma } from '../db/prisma';

declare global {
    namespace Express {
        interface Request {
            auth?: admin.auth.DecodedIdToken;
            user?: { id: string; role: string };
        }
    }
}

export async function decodeFirebaseToken(req: Request, res: Response, next: NextFunction) {
    const header = req.header('Authorization');
    if (!header?.toLowerCase().startsWith('bearer ')) return next();
    const idToken = header.slice(7).trim();

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.auth = decodedToken;

        const user = await prisma.user.upsert({
            where: { firebaseUid: decodedToken.uid },
            update: {
                email: decodedToken.email ?? undefined,
                displayName: decodedToken.name ?? undefined,
                photoURL: decodedToken.picture ?? undefined,
                emailVerified: decodedToken.email_verified ?? undefined,
            },
            create: {
                firebaseUid: decodedToken.uid,
                email: decodedToken.email ?? null,
                displayName: decodedToken.name ?? null,
                photoURL: decodedToken.picture ?? null,
                emailVerified: decodedToken.email_verified ?? false,
            },
            select: { id: true, role: true },
        });

        req.user = user;
        return next();
    } catch (err) {
        console.error('verifyIdToken failed', err);
        return res.status(401).json({ error: 'invalid_or_expired_token'});
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.user || !req.auth) return res.status(401).json({ error: 'auth_required'});
    return next();
}

export function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ error: 'auth_required' });
        if (req.user.role !== role) return res.status(403).json({ error: 'forbidden' });
        next();
    }
}