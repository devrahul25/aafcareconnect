import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';

export const authorize = (resource: string, action: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !req.user.user_roles) {
      return next(new AppError('User roles not found', 403, 'FORBIDDEN'));
    }

    let hasPermission = false;

    // Check through all user roles and permissions
    for (const ur of req.user.user_roles) {
      if (ur.role && ur.role.permissions) {
        for (const rp of ur.role.permissions) {
          // If user has admin:manage, they have all permissions
          if (rp.permission.resource === 'admin' && rp.permission.action === 'manage') {
            hasPermission = true;
            break;
          }
          if (rp.permission.resource === resource && rp.permission.action === action) {
            hasPermission = true;
            break;
          }
        }
      }
      if (hasPermission) break;
    }

    if (!hasPermission) {
      return next(
        new AppError(`Insufficient permissions for ${resource}:${action}`, 403, 'FORBIDDEN'),
      );
    }

    next();
  };
};
