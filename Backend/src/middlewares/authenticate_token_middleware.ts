import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { publicKey } from '../config';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' })
    }

    try {
        const decoded = verify(token, publicKey) as { user_id: string };
        req['userId'] = decoded.user_id;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};
