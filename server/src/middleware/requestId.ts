import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  
  // Expose to request context for downstream services
  req.headers['x-request-id'] = reqId;
  
  // Include in response headers for traceablity
  res.setHeader('X-Request-ID', reqId);
  
  next();
};
