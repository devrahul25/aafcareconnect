import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase';
import { prisma } from '../config/database';
import { AppError } from '../shared/errors/AppError';
import { asyncHandler } from '../shared/utils/asyncHandler';
import { LRUCache } from 'lru-cache';

// LRU Cache to prevent memory leaks while avoiding N+1 DB queries on every protected route.
const userCache = new LRUCache<string, any>({
  max: 5000, // Maximum number of active user sessions in memory
  ttl: 60 * 1000, // 1 minute cache
});

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided or invalid format', 401, 'UNAUTHORIZED'));
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      // Mock Token Support for Prototype/Local Dev
      if (
        idToken === 'mock-super-admin-token' ||
        idToken === 'mock-org-admin-token' ||
        idToken === 'mock-manager-token' ||
        idToken === 'mock-trainer-token' ||
        idToken === 'mock-learner-token'
      ) {
        req.user = {
          id: 'mock-user-id',
          email: 'mock@eserve.org.uk',
          status: 'ACTIVE'
        };
        return next();
      }

      // 1. Verify token with Firebase (enforce revocation check)
      const decodedToken = await firebaseAuth.verifyIdToken(idToken, true);
      const { uid } = decodedToken;

      // Check cache first
      let user = userCache.get(uid);
      if (!user) {
        // 2. Look up user in PostgreSQL
        user = await prisma.user.findUnique({
          where: { firebase_uid: uid },
          include: {
            organization: true,
            user_roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
            user_permissions: {
              include: {
                permission: true,
              },
            },
          },
        });

        if (user) {
          userCache.set(uid, user);
        }
      }

      if (!user) {
        return next(
          new AppError('User not registered in the system', 403, 'USER_NOT_REGISTERED'),
        );
      }

      if (user.status !== 'ACTIVE') {
        return next(new AppError('User account is inactive or suspended', 403, 'USER_SUSPENDED'));
      }

      // 3. Attach user and organizationId to request
      req.user = user;
      req.organizationId = user.organization_id;

      next();
    } catch (error: any) {
      if (error.code === 'auth/id-token-expired') {
        return next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
      }
      return next(new AppError('Invalid authentication token', 401, 'INVALID_TOKEN'));
    }
  },
);
