import { IEmailProvider } from './email.provider.interface';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

export class ResendEmailProvider implements IEmailProvider {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.RESEND_API_KEY || '';
  }

  async sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    try {
      const fromEmail = env.SMTP_FROM_EMAIL || 'no-reply@aafcareconnect.com';
      const fromName = env.SMTP_FROM_NAME || 'AAF CareConnect';

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [to],
          subject,
          html: htmlBody,
        }),
      });

      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Resend API error');
      }

      logger.info(`Email sent successfully to ${to} via Resend HTTPS API. ID: ${data.id}`);
    } catch (error: any) {
      logger.error(`Resend send email failed for ${to}: ${error.message}`);
      throw error;
    }
  }
}
