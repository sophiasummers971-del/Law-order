import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/auth'
import { logger } from '../utils/logger'

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export function setUserContext(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const token = authHeader.substring(7)
    const payload = verifyAccessToken(token)

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (err) {
    logger.warn('Invalid token:', { ip: req.ip, path: req.path })
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}
