import crypto from 'crypto';
import { env } from '../../config/env';

export class OTPUtil {
  /**
   * Generates a random 6-digit numeric OTP and its HMAC-SHA256 signature
   * @returns { code, hashedToken }
   */
  static generateOTP(): { code: string; hashedToken: string } {
    // Generate secure 6 digit numeric code
    const code = crypto.randomInt(100000, 999999).toString();
    
    const hashedToken = this.hashOTP(code);
    return { code, hashedToken };
  }

  /**
   * Hashes the raw OTP string using HMAC-SHA256 and the server's OTP_SECRET
   */
  static hashOTP(code: string): string {
    return crypto
      .createHmac('sha256', env.OTP_SECRET)
      .update(code)
      .digest('hex');
  }

  /**
   * Compares a plain OTP code against a stored hash securely using timingSafeEqual
   */
  static verifyOTP(code: string, storedHash: string): boolean {
    const candidateHash = this.hashOTP(code);
    const candidateBuffer = Buffer.from(candidateHash);
    const storedBuffer = Buffer.from(storedHash);

    // Prevent error if buffers are of different lengths somehow
    if (candidateBuffer.length !== storedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(candidateBuffer, storedBuffer);
  }
}
