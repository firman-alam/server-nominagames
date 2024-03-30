import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import JWT_SECRET_KEY from '../config/jwtSecret'

interface AuthenticatedRequest extends Request {
  user?: any
}

export function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['authorization']

  // Check if token exists
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. Not Authorized.', status: false })
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY)

    req.user = decoded.user

    next()
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ message: 'Invalid token.', status: false })
  }
}
