import { apiClient } from './base44Client';

// ---------------------------------------------------------------------------
// Auth API — all calls go to /api/v1/auth/*
// ---------------------------------------------------------------------------

export const authApi = {
  /**
   * Register a new user. Server sends OTP email.
   * @param {string} email
   * @param {string} password
   */
  register: (email, password) =>
    apiClient.post('/auth/register', { email, password }).then((r) => r.data),

  /**
   * Verify OTP code sent to email after registration.
   * Returns { access_token, refresh_token, user }
   */
  verifyOtp: (email, otpCode) =>
    apiClient.post('/auth/verify-otp', { email, otpCode }).then((r) => r.data),

  /**
   * Resend OTP verification email.
   */
  resendOtp: (email) =>
    apiClient.post('/auth/resend-otp', { email }).then((r) => r.data),

  /**
   * Login with a Firebase ID Token (obtained after Firebase client sign-in).
   * Returns { access_token, refresh_token, user }
   */
  login: (idToken) =>
    apiClient.post('/auth/login', { idToken }).then((r) => r.data),

  /**
   * Social login (Google / Microsoft / Apple / Facebook) with a Firebase ID Token.
   * Returns { access_token, refresh_token, user }
   */
  socialLogin: (idToken) =>
    apiClient.post('/auth/social-login', { idToken }).then((r) => r.data),

  /**
   * Refresh the access token using a refresh token.
   * Returns { access_token, refresh_token }
   */
  refresh: (refreshToken) =>
    apiClient.post('/auth/refresh', { refresh_token: refreshToken }).then((r) => r.data),

  /**
   * Logout the current session (invalidates refresh token).
   */
  logout: (refreshToken) =>
    apiClient.post('/auth/logout', { refresh_token: refreshToken }).then((r) => r.data),

  /**
   * Logout ALL sessions for the authenticated user.
   * Requires a valid access token (handled by apiClient interceptor).
   */
  logoutAll: () => apiClient.post('/auth/logout-all').then((r) => r.data),

  /**
   * Send OTP to email for password reset.
   */
  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }).then((r) => r.data),

  /**
   * Reset password using OTP code.
   * @param {string} email
   * @param {string} code  - 6-digit OTP received by email
   * @param {string} newPassword
   */
  resetPassword: (email, code, newPassword) =>
    apiClient.post('/auth/reset-password', { email, code, newPassword }).then((r) => r.data),
};
