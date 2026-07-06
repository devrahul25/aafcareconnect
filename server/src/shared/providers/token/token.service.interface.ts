export interface AccessTokenPayload {
  sub: string;
  org: string;
  role: string;
  jti?: string;
  sid: string;
  session_version: number;
}

export interface ITokenService {
  /**
   * Generates a new Access JWT with a unique jti
   */
  generateAccessToken(payload: Omit<AccessTokenPayload, 'jti'>): string;
  
  /**
   * Verifies the Access JWT and throws if invalid or expired
   */
  verifyAccessToken(token: string): AccessTokenPayload;
  
  /**
   * Decodes the Access JWT without verifying signature
   */
  decodeAccessToken(token: string): AccessTokenPayload | null;
  
  /**
   * Generates a unique JWT ID
   */
  generateJti(): string;

  /**
   * Generates a random crypto-secure string for refresh tokens
   */
  generateRefreshToken(): string;

  /**
   * Hashes a string using SHA-256 for secure DB storage
   */
  hashToken(token: string): string;
}
