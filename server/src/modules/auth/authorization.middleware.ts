import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { authorizationService } from './authorization.service';

/**
 * Middleware factory to enforce a specific permission.
 * MUST be registered after `requireAuth`.
 */
export const requirePermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isAllowed = await authorizationService.can(req as unknown as AuthenticatedRequest, resource, action);
      
      if (!isAllowed) {
        const authReq = req as any;
        console.error(`Authorization Failed. User ID: ${authReq.user?.id}, Required: ${resource}:${action}, Has: ${Array.from(authReq.permissions || [])}`);
        return res.status(403).json({ 
          success: false, 
          error: `Forbidden: Insufficient permissions for ${resource}:${action}`,
          code: 'AUTH_FORBIDDEN'
        });
      }

      next();
    } catch (error) {
      console.error('Authorization Middleware Error:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error during authorization' });
    }
  };
};
