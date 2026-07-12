import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../../shared/providers/token/jwt.token.service';
import { prisma } from '../../config/database';
import { permissionService } from './permission.service';
import { logger } from '../../config/logger';
import { OrganizationStatus, UserStatus } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  organization_id: string;
  session_version: number;
  sid: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  sessionId: string;
  organizationStatus: string;
  permissions: Set<string>;
  requestId: string;
  ipAddress: string;
  userAgent: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token format', code: 'AUTH_UNAUTHORIZED' });
  }

  const token = authHeader.split(' ')[1];

  // ==========================================
  // Development Mock Token Bypass
  // ==========================================
  if (
    token === 'mock-super-admin-token' ||
    token === 'mock-org-admin-token' ||
    token === 'mock-manager-token' ||
    token === 'mock-trainer-token' ||
    token === 'mock-learner-token'
  ) {
    let orgId = 'mock-org-id';
    try {
      const demoOrg = await prisma.organization.findFirst();
      if (demoOrg) orgId = demoOrg.id;
    } catch (e) {}

    let permissions = new Set<string>();
    let email = 'mock@eserve.org.uk';
    let fullName = 'Mock User';

    if (token === 'mock-super-admin-token') {
      permissions = new Set(['system:root', 'admin:manage']);
      email = 'admin@demo.com';
      fullName = 'System Super Admin';
    } else if (token === 'mock-org-admin-token') {
      permissions = new Set(['admin:manage', 'users:manage', 'courses:read']);
      email = 'orgadmin@eserve.org.uk';
      fullName = 'Org Admin';
    } else if (token === 'mock-manager-token') {
      permissions = new Set(['users:read']);
      email = 'manager@eserve.org.uk';
      fullName = 'Manager';
    } else if (token === 'mock-trainer-token') {
      permissions = new Set(['courses:create']);
      email = 'trainer@eserve.org.uk';
      fullName = 'Trainer';
    } else if (token === 'mock-learner-token') {
      permissions = new Set(['courses:read']);
      email = 'learner@eserve.org.uk';
      fullName = 'Learner';
    }

    const authReq = req as any;
    authReq.user = {
      id: 'mock-user-id',
      organization_id: orgId,
      status: 'ACTIVE',
      email: email,
      full_name: fullName,
      session_version: 1,
      organization: { status: 'ACTIVE' },
      user_roles: [{ role: { name: token.split('-')[1] + (token.includes('admin') ? '_admin' : '') } }]
    };
    authReq.organizationId = orgId;
    authReq.organizationStatus = 'ACTIVE';
    authReq.permissions = permissions;
    authReq.ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    
    return next();
  }

  try {
    // 1. Validate JWT Signature & Expiry
    const payload = tokenService.verifyAccessToken(token);

    // 2. Extract context
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const requestId = (req.headers['x-request-id'] as string) || 'unknown';

    // 3. Dynamic Validation (Session, Version, Revoked, User Active, Org Active)
    // To minimize DB load, we could cache this, but for now we do a fast query.
    // Given the strict requirements, we fetch the session, user, and organization.
    const session = await prisma.userSession.findFirst({
      where: { family_id: payload.sid, revoked_at: null },
      include: {
        user: {
          include: { organization: true }
        }
      }
    });

    if (!session) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Session invalid or revoked', code: 'AUTH_SESSION_EXPIRED' });
    }

    if (session.user.session_version !== payload.session_version) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Session version mismatch (global logout)', code: 'AUTH_SESSION_EXPIRED' });
    }

    if (session.user.status !== UserStatus.ACTIVE) {
      return res.status(403).json({ success: false, error: 'Forbidden: User account is not active', code: 'AUTH_FORBIDDEN' });
    }

    if (session.user.organization.status !== OrganizationStatus.ACTIVE) {
      return res.status(403).json({ success: false, error: 'Forbidden: Organization is not active', code: 'AUTH_FORBIDDEN' });
    }

    // 4. Resolve Permissions dynamically
    const permissions = await permissionService.getPermissions(payload.sub);

    // 5. Hydrate Request Context (compatible with existing middleware)
    const authReq = req as any; // Cast to any to allow dynamic properties

    // Set user with full context (for tenantContext compatibility)
    authReq.user = {
      id: payload.sub,
      organization_id: payload.org,
      session_version: payload.session_version,
      sid: payload.sid,
      organization: session.user.organization, // Required by tenantContext
      status: session.user.status,
      email: session.user.email,
      full_name: session.user.full_name,
    };

    // Set organizationId at request level (required by tenantContext)
    authReq.organizationId = payload.org;

    authReq.sessionId = session.id;
    authReq.organizationStatus = session.user.organization.status;
    authReq.permissions = permissions;
    authReq.requestId = requestId;
    authReq.ipAddress = ipAddress;
    authReq.userAgent = userAgent;

    next();
  } catch (error: any) {
    logger.warn(`Auth Middleware Error: ${error.message}`);
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token', code: 'AUTH_UNAUTHORIZED' });
  }
};
