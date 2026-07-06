import { IEmailProvider } from './email.provider.interface';
import { logger } from '../../../config/logger';

export class MockEmailProvider implements IEmailProvider {
  async sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    logger.info(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    logger.debug(`[MOCK EMAIL BODY]\n${htmlBody}`);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
