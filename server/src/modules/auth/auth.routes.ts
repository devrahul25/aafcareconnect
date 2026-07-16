import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requireAuth } from './auth.middleware';
import { validate, registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema, refreshSchema, logoutSchema, forgotPasswordSchema, resetPasswordSchema, socialLoginSchema } from './auth.validator';
import rateLimit from 'express-rate-limit';

const router = Router();

// Endpoint-specific rate limiting as per security requirements
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 registrations per IP per hour
  message: { success: false, error: 'Too many registration attempts. Please try again later.' },
});

const resendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 resend attempts per IP per hour
  message: { success: false, error: 'Too many resend attempts. Please try again later.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per IP
  message: { success: false, error: 'Too many login attempts. Please try again later.' },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Higher limit for refresh
  message: { success: false, error: 'Too many refresh attempts.' },
});

// Authentication Endpoints
router.post('/register', registerLimiter, validate(registerSchema), AuthController.register);
router.post('/login', loginLimiter, validate(loginSchema), AuthController.login);
router.post('/verify-otp', validate(verifyOtpSchema), AuthController.verifyOtp);
router.post('/resend-otp', resendLimiter, validate(resendOtpSchema), AuthController.resendOtp);

// Session Endpoints
router.get('/me', requireAuth, AuthController.me);
router.post('/refresh', refreshLimiter, validate(refreshSchema), AuthController.refresh);
router.post('/logout', validate(logoutSchema), AuthController.logout);
router.post('/logout-all', requireAuth, AuthController.logoutAll); // Enforces JWT validity + Session state

// Password Management Endpoints
router.post('/forgot-password', resendLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

// Social Login Endpoints
router.post('/social-login', loginLimiter, validate(socialLoginSchema), AuthController.socialLogin);

export const authRoutes = router;
