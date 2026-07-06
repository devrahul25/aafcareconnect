import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { asyncHandler } from '../shared/utils/asyncHandler';

export const tenantContext = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.organizationId || !req.user || !req.user.organization) {
      return next(new AppError('Organization context missing', 403, 'TENANT_CONTEXT_MISSING'));
    }

    const orgStatus = req.user.organization.status;
    if (orgStatus === 'SUSPENDED') {
      return next(
        new AppError('Organization account is suspended', 403, 'ORGANIZATION_SUSPENDED'),
      );
    }

    // Context is active and valid
    next();
  },
);
