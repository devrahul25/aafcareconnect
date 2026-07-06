import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../../config/env';
import { ITokenService, AccessTokenPayload } from './token.service.interface';
import { logger } from '../../../config/logger';

export class JwtTokenService implements ITokenService {
  generateJti(): string {
    return crypto.randomUUID();
  }

  generateAccessToken(payload: Omit<AccessTokenPayload, 'jti'>): string {
    const jti = this.generateJti();
    const finalPayload: AccessTokenPayload = {
      ...payload,
      jti,
    };

    return jwt.sign(finalPayload, env.JWT_SECRET as string, {
      expiresIn: (env.JWT_EXPIRES_IN || '15m') as any,
      algorithm: 'HS256',
    });
  }

  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET as string, {
        algorithms: ['HS256'],
      }) as unknown as AccessTokenPayload;
    } catch (error) {
      logger.error('JWT verification failed', error);
      throw new Error('Invalid or expired access token');
    }
  }

  decodeAccessToken(token: string): AccessTokenPayload | null {
    try {
      return jwt.decode(token) as AccessTokenPayload | null;
    } catch (error) {
      logger.error('JWT decoding failed', error);
      return null;
    }
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

export const tokenService = new JwtTokenService();
