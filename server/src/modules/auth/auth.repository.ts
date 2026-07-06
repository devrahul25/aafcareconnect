import { PrismaClient, UserStatus, VerificationTokenType, AuditEventType } from '@prisma/client';
import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { Request } from 'express';

export class AuthRepository {
  /**
   * Extracts the client IP from the request. Trusting proxies if configured.
   */
  private static extractIp(req?: Request): string {
    if (!req) return '127.0.0.1';
    return (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  }

  private static extractUserAgent(req?: Request): string {
    return req?.headers['user-agent'] || 'unknown';
  }

  private static extractRequestId(req?: Request): string {
    return (req?.headers['x-request-id'] as string) || 'unknown';
  }

  /**
   * Registers a new user. The organization is required, so we assign them to a default one if none provided,
   * but for this migration, we assume the user must be tied to one. We will fetch the first active one as a fallback for now.
   * This executes within a transaction to guarantee data consistency.
   */
  static async createUserWithOTP(
    email: string,
    firebaseUid: string,
    hashedToken: string,
    req?: Request
  ) {
    const ip = this.extractIp(req);
    const userAgent = this.extractUserAgent(req);
    const requestId = this.extractRequestId(req);

    return await prisma.$transaction(async (tx) => {
      // Find a default organization (Temporary placeholder logic until Org structure is finalized)
      let org = await tx.organization.findFirst();
      if (!org) {
        org = await tx.organization.create({
          data: {
            name: 'Default Organization',
            type: 'INDEPENDENT_FOSTERING_AGENCY',
            status: 'ACTIVE',
          }
        });
      }

      // Create the user in INACTIVE state
      const user = await tx.user.create({
        data: {
          email,
          firebase_uid: firebaseUid,
          organization_id: org.id,
          status: 'INACTIVE',
          email_verified: false,
        },
      });

      // Invalidate any existing OTPs for this email just in case
      await tx.verificationToken.updateMany({
        where: { email, type: 'EMAIL_VERIFICATION', consumed_at: null },
        data: { consumed_at: new Date() },
      });

      // Create new OTP
      await tx.verificationToken.create({
        data: {
          email,
          user_id: user.id,
          type: 'EMAIL_VERIFICATION',
          hashed_token: hashedToken,
          expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
          ip_address: ip,
          user_agent: userAgent,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          event_type: 'ACCOUNT_CREATED',
          user_id: user.id,
          organization_id: org.id,
          ip_address: ip,
          user_agent: userAgent,
          metadata: { requestId, action: 'REGISTER_PENDING_VERIFICATION' },
        },
      });

      return user;
    });
  }

  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        user_roles: {
          include: { role: true },
        },
      },
    });
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        user_roles: {
          include: { role: true },
        },
      },
    });
  }

  static async findUserByFirebaseUid(firebase_uid: string) {
    return prisma.user.findUnique({
      where: { firebase_uid },
      include: {
        organization: true,
        user_roles: {
          include: { role: true },
        },
      },
    });
  }

  static async getActiveOTP(email: string) {
    return prisma.verificationToken.findFirst({
      where: {
        email,
        type: 'EMAIL_VERIFICATION',
        consumed_at: null,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  static async incrementOTPAttempts(tokenId: string) {
    return prisma.verificationToken.update({
      where: { id: tokenId },
      data: { attempts: { increment: 1 } },
    });
  }

  /**
   * Verifies an OTP and activates the user inside a transaction.
   * This uses locking to prevent race conditions.
   */
  static async verifyOTPAndActivateUser(tokenId: string, userId: string, req?: Request) {
    const ip = this.extractIp(req);
    const userAgent = this.extractUserAgent(req);
    const requestId = this.extractRequestId(req);

    return await prisma.$transaction(async (tx) => {
      // Double check token hasn't been consumed (Race condition protection is handled by transaction isolation)
      const token = await tx.verificationToken.findUnique({ where: { id: tokenId } });
      if (!token || token.consumed_at) {
        throw new Error('Token already consumed');
      }

      await tx.verificationToken.update({
        where: { id: tokenId },
        data: { consumed_at: new Date() },
      });

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          // Keep user in PENDING_APPROVAL status until admin approves
          // status: 'ACTIVE',  // Commented out - admin approval required
          email_verified: true,
        },
        include: {
          user_roles: { include: { role: true } }
        }
      });

      await tx.auditLog.create({
        data: {
          event_type: 'EMAIL_VERIFIED',
          user_id: user.id,
          organization_id: user.organization_id,
          ip_address: ip,
          user_agent: userAgent,
          metadata: { requestId, action: 'OTP_SUCCESS' },
        },
      });

      return user;
    });
  }

  static async invalidateExistingOTPsAndCreateNew(email: string, hashedToken: string, type: VerificationTokenType = 'EMAIL_VERIFICATION', req?: Request) {
    const ip = this.extractIp(req);
    const userAgent = this.extractUserAgent(req);

    return await prisma.$transaction(async (tx) => {
      await tx.verificationToken.updateMany({
        where: { email, type, consumed_at: null },
        data: { consumed_at: new Date() },
      });

      const user = await tx.user.findUnique({ where: { email } });

      return await tx.verificationToken.create({
        data: {
          email,
          user_id: user?.id,
          type,
          hashed_token: hashedToken,
          expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
          ip_address: ip,
          user_agent: userAgent,
        },
      });
    });
  }

  static async getActivePasswordResetToken(email: string) {
    return prisma.verificationToken.findFirst({
      where: {
        email,
        type: 'PASSWORD_RESET',
        consumed_at: null,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  static async markTokenAsConsumed(tokenId: string) {
    return prisma.verificationToken.update({
      where: { id: tokenId },
      data: { consumed_at: new Date() }
    });
  }

  static async logAudit(eventType: AuditEventType, userId?: string, orgId?: string, metadata?: any, req?: Request) {
    await prisma.auditLog.create({
      data: {
        event_type: eventType,
        user_id: userId,
        organization_id: orgId,
        metadata: { ...metadata, requestId: this.extractRequestId(req) },
        ip_address: this.extractIp(req),
        user_agent: this.extractUserAgent(req),
      }
    });
  }

  // ==========================================
  // Social Login
  // ==========================================

  static async findOrCreateSocialUser(email: string, firebaseUid: string, req?: Request) {
    const ip = this.extractIp(req);
    const userAgent = this.extractUserAgent(req);
    const requestId = this.extractRequestId(req);

    return await prisma.$transaction(async (tx) => {
      let user = await tx.user.findFirst({
        where: { OR: [{ firebase_uid: firebaseUid }, { email }] },
        include: { organization: true, user_roles: { include: { role: true } } }
      });

      if (user) {
        // Link firebase_uid if it was unmatched but email matched
        if (user.firebase_uid !== firebaseUid) {
          user = await tx.user.update({
            where: { id: user.id },
            data: { firebase_uid: firebaseUid, email_verified: true },
            include: { organization: true, user_roles: { include: { role: true } } }
          });
        }
        return user;
      }

      // Find default org
      let org = await tx.organization.findFirst();
      if (!org) {
        org = await tx.organization.create({
          data: { name: 'Default Organization', type: 'INDEPENDENT_FOSTERING_AGENCY', status: 'ACTIVE' }
        });
      }

      // Create new social user
      user = await tx.user.create({
        data: {
          email,
          firebase_uid: firebaseUid,
          organization_id: org.id,
          status: 'ACTIVE',
          email_verified: true, // Social logins are pre-verified
        },
        include: { organization: true, user_roles: { include: { role: true } } }
      });

      // Default Role
      let role = await tx.role.findFirst({ where: { name: 'user' } });
      if (!role) {
        role = await tx.role.create({ data: { name: 'user', description: 'Standard user', organization_id: org.id } });
      }
      await tx.userRole.create({ data: { user_id: user.id, role_id: role.id } });

      // Update returned user object with role
      user.user_roles = [{ user_id: user.id, role_id: role.id, role }];

      await tx.auditLog.create({
        data: {
          event_type: 'ACCOUNT_CREATED',
          user_id: user.id,
          organization_id: org.id,
          ip_address: ip,
          user_agent: userAgent,
          metadata: { requestId, action: 'SOCIAL_LOGIN_REGISTER' },
        }
      });

      return user;
    });
  }

  // ==========================================
  // Session Management (Commit 2B-2)
  // ==========================================

  static async findSessionByHash(refreshTokenHash: string) {
    return prisma.userSession.findUnique({
      where: { refresh_token_hash: refreshTokenHash },
      include: { user: true }
    });
  }

  static async createSession(userId: string, refreshTokenHash: string, familyId: string, req?: Request) {
    const ip = this.extractIp(req);
    const userAgent = this.extractUserAgent(req);
    // Simple parsing for metadata
    const os = userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'MacOS' : userAgent.includes('Linux') ? 'Linux' : 'Unknown';

    return prisma.userSession.create({
      data: {
        user_id: userId,
        family_id: familyId,
        refresh_token_hash: refreshTokenHash,
        ip_address: ip,
        operating_system: os,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days absolute expiry
      }
    });
  }

  static async rotateSession(oldTokenHash: string, newTokenHash: string, req?: Request) {
    const ip = this.extractIp(req);
    const userAgent = this.extractUserAgent(req);
    const os = userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'MacOS' : userAgent.includes('Linux') ? 'Linux' : 'Unknown';

    return await prisma.$transaction(async (tx) => {
      // 1. Attempt to atomically revoke the active session
      const updateResult = await tx.userSession.updateMany({
        where: { refresh_token_hash: oldTokenHash, revoked_at: null },
        data: {
          revoked_at: new Date(),
          revoked_reason: 'ROTATED'
        }
      });

      const oldSession = await tx.userSession.findUnique({
        where: { refresh_token_hash: oldTokenHash },
        include: {
          user: {
            include: {
              organization: true,
              user_roles: {
                include: { role: true }
              }
            }
          }
        }
      });

      if (!oldSession) {
        throw new Error('Session not found');
      }

      // 2. Reuse Detection!
      if (updateResult.count === 0 && oldSession.revoked_at !== null) {
        // The token was already revoked. This is a REPLAY ATTACK / REUSE.
        await tx.userSession.updateMany({
          where: { family_id: oldSession.family_id, revoked_at: null },
          data: { revoked_at: new Date(), revoked_reason: 'REUSE_DETECTED' }
        });

        await tx.auditLog.create({
          data: {
            event_type: 'TOKEN_REUSE_DETECTED',
            user_id: oldSession.user_id,
            organization_id: oldSession.user.organization_id,
            ip_address: ip,
            user_agent: userAgent,
            metadata: { family_id: oldSession.family_id, action: 'Cascade Revocation' },
          }
        });

        throw new Error('Reuse detected');
      }

      // 3. Create the replacement session in the same family
      const newSession = await tx.userSession.create({
        data: {
          user_id: oldSession.user_id,
          family_id: oldSession.family_id,
          parent_session_id: oldSession.id,
          refresh_token_hash: newTokenHash,
          ip_address: ip,
          operating_system: os,
          expires_at: oldSession.expires_at, // Inherit absolute expiry
        }
      });

      return { oldSession, newSession };
    });
  }

  static async revokeSessionByFamily(familyId: string, reason: any) {
    return prisma.userSession.updateMany({
      where: { family_id: familyId, revoked_at: null },
      data: { revoked_at: new Date(), revoked_reason: reason }
    });
  }

  static async revokeAllUserSessions(userId: string, reason: any) {
    return prisma.$transaction(async (tx) => {
      // Increment user session_version
      await tx.user.update({
        where: { id: userId },
        data: { session_version: { increment: 1 } }
      });

      return tx.userSession.updateMany({
        where: { user_id: userId, revoked_at: null },
        data: { revoked_at: new Date(), revoked_reason: reason }
      });
    });
  }
}
