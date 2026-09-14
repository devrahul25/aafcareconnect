import { IEmailProvider } from './email.provider.interface';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

export class BrevoEmailProvider implements IEmailProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.BREVO_API_KEY || '';
  }

  async sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    try {
      const fromEmail = env.SMTP_FROM_EMAIL || 'no-reply@aafcareconnect.com';
      const fromName = env.SMTP_FROM_NAME || 'AAF CareConnect';

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: fromName, email: fromEmail },
          to: [{ email: to }],
          subject,
          htmlContent: htmlBody,
        }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Brevo API error');
      }

      logger.info(`Email sent successfully to ${to} via Brevo HTTPS API. MessageId: ${data.messageId}`);
    } catch (error: any) {
      logger.error(`Brevo send email failed for ${to}: ${error.message}`);
      throw error;
    }
  }
}
