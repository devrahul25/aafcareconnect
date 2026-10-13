import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { prisma } from '../config/database';

export const tenantContext = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // 1. Resolve organizationId if not already set on request
    if (!req.organizationId) {
      if (req.query.organization_id) {
        req.organizationId = req.query.organization_id as string;
      } else if (req.headers['x-organization-id']) {
        req.organizationId = req.headers['x-organization-id'] as string;
      } else if (req.user?.organization_id) {
        req.organizationId = req.user.organization_id;
      } else {
        const firstOrg = await prisma.organization.findFirst({ where: { status: 'ACTIVE' } });
        if (firstOrg) {
          req.organizationId = firstOrg.id;
        }
      }
    }

    // 2. Ensure user object has organization attached
    if (req.user && !req.user.organization && req.organizationId) {
      const org = await prisma.organization.findUnique({ where: { id: req.organizationId } });
      if (org) {
        req.user.organization = org;
      }
    }

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
