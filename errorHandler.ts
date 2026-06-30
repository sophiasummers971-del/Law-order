import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  })

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'An internal error occurred'
    : err.message

  res.status(500).json({
    error: 'Internal server error',
    message,
  })
}
