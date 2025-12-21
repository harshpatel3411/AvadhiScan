import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from 'server/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
console.log(JWT_SECRET)

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log(token)
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log(decoded);
    req.userId = decoded.userId;
  
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
