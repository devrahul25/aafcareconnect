import { Request, Response } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { authService } from './auth.service';
import { AuthSerializer } from './auth.serializer';
import { logger } from '../../config/logger';

export class AuthController {
  
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      await authService.register(email, password, req);
      
      res.status(200).json(
        AuthSerializer.success(null, 'Registration pending. Please check your email for the verification code.')
      );
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        res.status(409).json({ success: false, error: error.message, code: 'AUTH_DUPLICATE_EMAIL' });
      } else {
        res.status(400).json({ success: false, error: error.message, code: 'AUTH_REGISTRATION_FAILED' });
      }
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otpCode } = req.body;
      
      const { access_token, refresh_token, user } = await authService.verifyOtp(email, otpCode, req);
      
      res.status(200).json(
        AuthSerializer.success({
          access_token,
          refresh_token,
          user: AuthSerializer.serializeUser(user),
        }, 'Email verified successfully.')
      );
    } catch (error: any) {
      if (error.message.includes('expired') || error.message.includes('Invalid') || error.message.includes('failed attempts')) {
        res.status(400).json({ success: false, error: error.message, code: 'AUTH_INVALID_OTP' });
      } else {
        logger.error('Verify OTP Error', error);
        res.status(500).json({ success: false, error: 'Internal server error', code: 'AUTH_INTERNAL_ERROR' });
      }
    }
  }

  static async resendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      await authService.resendOtp(email, req);
      
      res.status(200).json(
        AuthSerializer.success(null, 'If the email exists, a new verification code has been sent.')
      );
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message, code: 'AUTH_RESEND_FAILED' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      
      const { access_token, refresh_token, user } = await authService.login(idToken, req);
      
      res.status(200).json(
        AuthSerializer.success({
          access_token,
          refresh_token,
          user: AuthSerializer.serializeUser(user),
        }, 'Login successful.')
      );
    } catch (error: any) {
      const msg = error.message;
      if (msg.includes('Invalid or expired identity token') || msg.includes('Account not found')) {
        res.status(401).json({ success: false, error: msg, code: 'AUTH_UNAUTHORIZED' });
      } else if (msg.includes('Registration pending') || msg.includes('suspended')) {
        res.status(403).json({ success: false, error: msg, code: 'AUTH_FORBIDDEN' });
      } else {
        logger.error('Login Error', error);
        res.status(500).json({ success: false, error: 'Internal server error', code: 'AUTH_INTERNAL_ERROR' });
      }
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;
      const { access_token, refresh_token: new_refresh_token } = await authService.refresh(refresh_token, req);
      
      res.status(200).json(
        AuthSerializer.success({
          access_token,
          refresh_token: new_refresh_token,
        }, 'Token refreshed.')
      );
    } catch (error: any) {
      if (error.message.includes('Security alert')) {
        res.status(403).json({ success: false, error: error.message, code: 'AUTH_REPLAY_DETECTED' });
      } else if (error.message.includes('suspended') || error.message.includes('expired')) {
        res.status(403).json({ success: false, error: error.message, code: 'AUTH_SESSION_EXPIRED' });
      } else {
        res.status(401).json({ success: false, error: 'Invalid refresh token.', code: 'AUTH_UNAUTHORIZED' });
      }
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;
      await authService.logout(refresh_token, req);
      res.status(200).json(AuthSerializer.success(null, 'Logged out successfully.'));
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error', code: 'AUTH_INTERNAL_ERROR' });
    }
  }

  static async logoutAll(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      await authService.logoutAll(authReq.user.id, req);
      res.status(200).json(AuthSerializer.success(null, 'All sessions logged out successfully.'));
    } catch (error) {
      res.status(401).json({ success: false, error: 'Unauthorized', code: 'AUTH_UNAUTHORIZED' });
    }
  }

  // ==========================================
  // Forgot / Reset Password (Commit 2B-4)
  // ==========================================

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email, req);
      // Always return success to prevent email enumeration
      res.status(200).json(AuthSerializer.success(null, 'If the email exists, a password reset link has been sent.'));
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message, code: 'AUTH_FORGOT_PASSWORD_FAILED' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, code, newPassword } = req.body;
      await authService.resetPassword(email, code, newPassword, req);
      res.status(200).json(AuthSerializer.success(null, 'Password has been successfully reset.'));
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message, code: 'AUTH_INVALID_OTP' });
    }
  }

  // ==========================================
  // Social Login (Commit 2B-4)
  // ==========================================

  static async socialLogin(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      const { access_token, refresh_token, user } = await authService.socialLogin(idToken, req);
      
      res.status(200).json(
        AuthSerializer.success({
          access_token,
          refresh_token,
          user: AuthSerializer.serializeUser(user),
        }, 'Social login successful.')
      );
    } catch (error: any) {
      const msg = error.message;
      if (msg.includes('Invalid or expired identity token')) {
        res.status(401).json({ success: false, error: msg, code: 'AUTH_UNAUTHORIZED' });
      } else if (msg.includes('suspended')) {
        res.status(403).json({ success: false, error: msg, code: 'AUTH_FORBIDDEN' });
      } else {
        logger.error('Social Login Error', error);
        res.status(500).json({ success: false, error: 'Internal server error', code: 'AUTH_INTERNAL_ERROR' });
      }
    }
  }
}
