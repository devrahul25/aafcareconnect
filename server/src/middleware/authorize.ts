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
          const { resource: res, action: act } = rp.permission;

          // system:root — super_admin bypass (all permissions granted)
          if (res === 'system' && act === 'root') {
            hasPermission = true;
            break;
          }
          // admin:manage — org_admin bypass (all permissions granted)
          if (res === 'admin' && act === 'manage') {
            hasPermission = true;
            break;
          }
          // Exact resource:action match
          if (res === resource && (act === action || act === 'manage')) {
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

