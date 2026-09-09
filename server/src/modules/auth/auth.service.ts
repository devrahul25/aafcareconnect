import { Request } from 'express';
import { IIdentityProvider } from '../../shared/providers/identity/identity.provider.interface';
import { FirebaseAdminService } from '../../shared/providers/identity/firebase-admin.service';
import { EmailService } from '../../shared/providers/email/email.service';
import { AuthRepository } from './auth.repository';
import { OTPUtil } from '../../shared/utils/otp.util';
import { logger } from '../../config/logger';
import crypto from 'crypto';
import { tokenService } from '../../shared/providers/token/jwt.token.service';
import { env } from '../../config/env';
import bcrypt from 'bcrypt';

export class AuthService {
  private identityProvider: IIdentityProvider;
  private emailService: EmailService;

  constructor() {
    this.identityProvider = new FirebaseAdminService();
    this.emailService = new EmailService();
  }

  async register(email: string, password?: string, req?: Request) {
    const existingUser = await AuthRepository.findUserByEmail(email);
    if (existingUser) {
      if (existingUser.status === 'ACTIVE') {
        throw new Error('Email already in use');
      }
      throw new Error('Registration pending. Please verify your email.');
    }

    let firebaseUid: string = '';
    let registrationAttempts = 0;
    const maxAttempts = 2; // Initial try + 1 retry

    while (registrationAttempts < maxAttempts) {
      registrationAttempts++;
      try {
        firebaseUid = await this.identityProvider.createUser(email, password);
        break; // Success, exit loop
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          const dbUser = await AuthRepository.findUserByEmail(email);
          if (dbUser) {
            throw new Error('Email already in use');
          }

          // Orphaned Firebase Account Detected
          logger.warn(`Orphaned Firebase account detected for ${email}. Deleting and retrying...`);

          await this.identityProvider.deleteUserByEmail(email);

          if (registrationAttempts >= maxAttempts) {
            throw new Error('Registration failed due to orphaned account. Please try again later.');
          }
          continue; // Retry
        }
        throw error;
      }
    }

    const { code, hashedToken } = OTPUtil.generateOTP();

    try {
      await AuthRepository.createUserWithOTP(email, firebaseUid, hashedToken, req);
    } catch (error) {
      logger.error(`DB Registration failed for ${email}, rolling back Firebase user ${firebaseUid}`);
      await this.identityProvider.deleteUser(firebaseUid).catch((e) => {
        logger.error(`CRITICAL: Failed to rollback Firebase user ${firebaseUid}`, e);
      });
      throw new Error('Registration failed. Please try again.');
    }

    try {
      // The user name isn't required in register schema yet, so we just use email prefix
      await this.emailService.sendVerificationEmail(email, email.split('@')[0], code);
    } catch (error) {
      logger.warn(`Failed to send verification email to ${email}. User remains inactive.`);
    }

    return true;
  }

  async verifyOtp(email: string, code: string, req?: Request) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) throw new Error('User not found');
    if (user.email_verified && user.status === 'PENDING_APPROVAL') {
      throw new Error('Email already verified. Waiting for admin approval.');
    }
    if (user.status === 'ACTIVE') throw new Error('User already verified and approved');

    const token = await AuthRepository.getActiveOTP(email);
    if (!token) throw new Error('Code expired. Please request a new one.');

    if (token.attempts >= 5) {
      throw new Error('Too many failed attempts. Please request a new code.');
    }

    if (token.expires_at < new Date()) {
      throw new Error('Code expired. Please request a new one.');
    }

    const isValid = OTPUtil.verifyOTP(code, token.hashed_token);
    if (!isValid) {
      await AuthRepository.incrementOTPAttempts(token.id);
      await AuthRepository.logAudit('LOGIN_FAILED', user.id, user.organization_id, { attempt: token.attempts + 1, reason: 'Invalid OTP' }, req);
      throw new Error('Invalid verification code');
    }

    const verifiedUser = await AuthRepository.verifyOTPAndActivateUser(token.id, user.id, req);

    // User is verified but needs admin approval
    if (verifiedUser.status === 'PENDING_APPROVAL') {
      throw new Error('Email verified successfully. Your account is pending admin approval. You will be notified once approved.');
    }

    // If user is ACTIVE (shouldn't happen with current flow, but kept for backwards compatibility)
    // Determine role string
    let role_type = 'user';
    if (verifiedUser.user_roles && verifiedUser.user_roles.length > 0) {
      role_type = verifiedUser.user_roles[0].role?.name || 'user';
    }

    const familyId = crypto.randomUUID();
    const rawRefreshToken = tokenService.generateRefreshToken();
    const hashedToken = tokenService.hashToken(rawRefreshToken);

    await AuthRepository.createSession(verifiedUser.id, hashedToken, familyId, req);

    const access_token = tokenService.generateAccessToken({
      sub: verifiedUser.id,
      org: verifiedUser.organization_id,
      role: role_type,
      sid: familyId,
      session_version: verifiedUser.session_version,
    });

    return { access_token, refresh_token: rawRefreshToken, user: verifiedUser };
  }

  async login(idToken: string, req?: Request) {
    const t0 = performance.now();

    // 1. Verify Firebase Token (checkRevoked = true to enforce revocation list)
    let decodedToken;
    try {
      decodedToken = await this.identityProvider.verifyToken(idToken, true);
    } catch (error: any) {
      // IdentityProvider already maps revoked/invalid errors
      throw new Error(error.message || 'Invalid or expired identity token');
    }
    const t1 = performance.now();

    // 2. Lookup User in Postgres by firebase_uid
    const user = await AuthRepository.findUserByFirebaseUid(decodedToken.uid);
    const t2 = performance.now();

    if (!user) {
      throw new Error('Account not found in the system');
    }

    if (user.status === 'PENDING_APPROVAL') {
      throw new Error('Your account is pending admin approval. You will be notified once approved.');
    }

    if (user.status === 'INACTIVE') {
      throw new Error('Registration pending. Please verify your email.');
    }

    if (user.status === 'SUSPENDED') {
      throw new Error('Account suspended. Please contact support.');
    }

    if (user.organization?.status === 'SUSPENDED') {
      throw new Error('Organization account suspended.');
    }

    // Determine primary role
    let role_type = 'user';
    if (user.user_roles && user.user_roles.length > 0) {
      role_type = user.user_roles[0].role?.name || 'user';
    }

    // 3. Generate Session & Tokens
    const familyId = crypto.randomUUID();
    const rawRefreshToken = tokenService.generateRefreshToken();
    const hashedToken = tokenService.hashToken(rawRefreshToken);

    await AuthRepository.createSession(user.id, hashedToken, familyId, req);

    const access_token = tokenService.generateAccessToken({
      sub: user.id,
      org: user.organization_id,
      role: role_type,
      sid: familyId,
      session_version: user.session_version,
    });
    const t3 = performance.now();

    // 4. Audit Log with Performance Metrics
    const metrics = {
      fb_verify_ms: Math.round(t1 - t0),
      db_lookup_ms: Math.round(t2 - t1),
      jwt_gen_ms: Math.round(t3 - t2),
      total_ms: Math.round(t3 - t0),
    };

    await AuthRepository.logAudit('SESSION_CREATED', user.id, user.organization_id, { metrics, familyId }, req);

    return { access_token, refresh_token: rawRefreshToken, user };
  }

  async resendOtp(email: string, req?: Request) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) return true;
    if (user.status === 'ACTIVE') throw new Error('User already verified');

    const { code, hashedToken } = OTPUtil.generateOTP();

    await AuthRepository.invalidateExistingOTPsAndCreateNew(email, hashedToken, 'EMAIL_VERIFICATION', req);

    try {
      await this.emailService.sendVerificationEmail(email, user.full_name || email.split('@')[0], code);
      await AuthRepository.logAudit('OTP_SENT', user.id, user.organization_id, null, req);
    } catch (error) {
      logger.error('Resend OTP Email failed', error);
      throw new Error('Failed to send email. Please try again later.');
    }

    return true;
  }

  // ==========================================
  // Session Management Methods (Commit 2B-2)
  // ==========================================

  async refresh(oldRefreshToken: string, req?: Request) {
    const hashedOldToken = tokenService.hashToken(oldRefreshToken);
    const rawNewToken = tokenService.generateRefreshToken();
    const hashedNewToken = tokenService.hashToken(rawNewToken);

    try {
      const { oldSession, newSession } = await AuthRepository.rotateSession(hashedOldToken, hashedNewToken, req);

      // Check expiry of old session
      if (oldSession.expires_at < new Date()) {
        await AuthRepository.revokeSessionByFamily(oldSession.family_id, 'EXPIRED');
        await AuthRepository.logAudit('SESSION_EXPIRED', oldSession.user_id, oldSession.user.organization_id, { familyId: oldSession.family_id }, req);
        throw new Error('Session expired. Please log in again.');
      }

      // Check user status
      if (oldSession.user.status !== 'ACTIVE' || oldSession.user.organization?.status !== 'ACTIVE') {
        throw new Error('Account suspended or inactive.');
      }

      let role_type = 'user';
      if (oldSession.user.user_roles && oldSession.user.user_roles.length > 0) {
        role_type = oldSession.user.user_roles[0].role?.name || 'user';
      }

      const access_token = tokenService.generateAccessToken({
        sub: oldSession.user.id,
        org: oldSession.user.organization_id,
        role: role_type,
        sid: newSession.family_id,
        session_version: oldSession.user.session_version,
      });

      await AuthRepository.logAudit('SESSION_ROTATED', oldSession.user.id, oldSession.user.organization_id, { familyId: newSession.family_id }, req);

      return { access_token, refresh_token: rawNewToken };

    } catch (error: any) {
      if (error.message === 'Reuse detected') {
        throw new Error('Security alert: Session invalidated due to unauthorized reuse.');
      }
      if (error.message === 'Session not found') {
        throw new Error('Invalid refresh token.');
      }
      throw error;
    }
  }

  async logout(refreshToken: string, req?: Request) {
    const hashedToken = tokenService.hashToken(refreshToken);
    // Find the session directly without locking
    const session = await AuthRepository.findSessionByHash(hashedToken);

    if (session) {
      await AuthRepository.revokeSessionByFamily(session.family_id, 'LOGOUT');
      await AuthRepository.logAudit('LOGOUT', session.user_id, session.user.organization_id, { familyId: session.family_id }, req);
    }
    return true;
  }

  async logoutAll(userId: string, req?: Request) {
    // We shouldn't use prisma directly in the service
    // But since we need orgId for the audit log, let's just use the repo
    const orgQuery = await AuthRepository.findUserById(userId);
    if (orgQuery) {
      await AuthRepository.revokeAllUserSessions(userId, 'LOGOUT_ALL');
      await AuthRepository.logAudit('LOGOUT_ALL', userId, orgQuery.organization_id, null, req);
    }
    return true;
  }

  // ==========================================
  // Forgot / Reset Password (Commit 2B-4)
  // ==========================================

  async forgotPassword(email: string, req?: Request) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) return true; // Fail silently to prevent enumeration

    if (user.status !== 'ACTIVE') {
      throw new Error('Account inactive or suspended');
    }

    const { code, hashedToken } = OTPUtil.generateOTP();

    await AuthRepository.invalidateExistingOTPsAndCreateNew(email, hashedToken, 'PASSWORD_RESET', req);

    try {
      await this.emailService.sendPasswordResetEmail(email, user.full_name || email.split('@')[0], code);
      await AuthRepository.logAudit('PASSWORD_RESET_REQUEST', user.id, user.organization_id, null, req);
    } catch (error) {
      logger.error('Forgot password email failed', error);
      throw new Error('Failed to send reset email. Please try again later.');
    }

    return true;
  }

  async resetPassword(email: string, code: string, newPassword: string, req?: Request) {
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) throw new Error('Invalid request');

    const token = await AuthRepository.getActivePasswordResetToken(email);
    if (!token) throw new Error('Code expired or invalid. Please request a new one.');

    if (token.attempts >= 5) {
      throw new Error('Too many failed attempts. Please request a new code.');
    }

    if (token.expires_at < new Date()) {
      throw new Error('Code expired. Please request a new one.');
    }

    const isValid = OTPUtil.verifyOTP(code, token.hashed_token);
    if (!isValid) {
      await AuthRepository.incrementOTPAttempts(token.id);
      await AuthRepository.logAudit('PASSWORD_CHANGED', user.id, user.organization_id, { attempt: token.attempts + 1, reason: 'Invalid OTP', success: false }, req);
      throw new Error('Invalid reset code');
    }

    // 1. Mark token consumed
    await AuthRepository.markTokenAsConsumed(token.id);

    // 2. Update password in Firebase (with self-healing fallback by email)
    const resolvedUid = await this.identityProvider.updatePassword(user.firebase_uid, newPassword, email);

    // 3. Hash password with bcrypt and update DB record (syncing valid firebase_uid)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await AuthRepository.updateUserPassword(user.id, resolvedUid || user.firebase_uid, passwordHash);

    // 4. Increment session_version and revoke all sessions
    await AuthRepository.revokeAllUserSessions(user.id, 'PASSWORD_RESET');

    // 5. Log audit
    await AuthRepository.logAudit('PASSWORD_CHANGED', user.id, user.organization_id, { success: true }, req);

    return true;
  }

  // ==========================================
  // Social Login (Commit 2B-4)
  // ==========================================

  async socialLogin(idToken: string, req?: Request) {
    const t0 = performance.now();

    let decodedToken;
    try {
      decodedToken = await this.identityProvider.verifyToken(idToken, true);
    } catch (error: any) {
      throw new Error(error.message || 'Invalid or expired identity token');
    }
    const t1 = performance.now();

    if (!decodedToken.email) {
      throw new Error('Social login requires a verified email address');
    }

    const user = await AuthRepository.findOrCreateSocialUser(decodedToken.email, decodedToken.uid, req);
    const t2 = performance.now();

    if (user.status === 'SUSPENDED') {
      throw new Error('Account suspended. Please contact support.');
    }

    if (user.organization?.status === 'SUSPENDED') {
      throw new Error('Organization account suspended.');
    }

    let role_type = 'user';
    if (user.user_roles && user.user_roles.length > 0) {
      role_type = user.user_roles[0].role?.name || 'user';
    }

    const familyId = crypto.randomUUID();
    const rawRefreshToken = tokenService.generateRefreshToken();
    const hashedToken = tokenService.hashToken(rawRefreshToken);

    await AuthRepository.createSession(user.id, hashedToken, familyId, req);

    const access_token = tokenService.generateAccessToken({
      sub: user.id,
      org: user.organization_id,
      role: role_type,
      sid: familyId,
      session_version: user.session_version,
    });
    const t3 = performance.now();

    const metrics = {
      fb_verify_ms: Math.round(t1 - t0),
      db_lookup_ms: Math.round(t2 - t1),
      jwt_gen_ms: Math.round(t3 - t2),
      total_ms: Math.round(t3 - t0),
    };

    await AuthRepository.logAudit('SESSION_CREATED', user.id, user.organization_id, { metrics, familyId, provider: 'social' }, req);

    return { access_token, refresh_token: rawRefreshToken, user };
  }
}

export const authService = new AuthService();
