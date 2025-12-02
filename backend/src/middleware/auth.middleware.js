import { auth } from '../config/firebase.js';

/**
 * Middleware to verify Firebase ID token
 */
export async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];

        try {
            const decodedToken = await auth.verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email
            };
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
}

/**
 * Optional auth - sets user if token is valid, but doesn't reject if missing
 */
export async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            try {
                const decodedToken = await auth.verifyIdToken(token);
                req.user = {
                    uid: decodedToken.uid,
                    email: decodedToken.email
                };
            } catch (error) {
                // Invalid token, but we continue anyway
                console.warn('Invalid token in optional auth');
            }
        }

        next();
    } catch (error) {
        console.error('Optional auth middleware error:', error);
        next();
    }
}
