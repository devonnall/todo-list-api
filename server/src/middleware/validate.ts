import { ZodType, z } from 'zod';
import { RequestHandler } from 'express';

export const validate = (schema: ZodType, which: 'body' | 'query' | 'params' = 'body'): RequestHandler => 
    (req, res, next) => {
        const result = schema.safeParse(req[which]);
        if (!result.success) return res.status(400).json({ errors: z.treeifyError(result.error) });
        req[which] = result.data;
        next();
    };