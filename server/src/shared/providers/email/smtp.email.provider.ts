import nodemailer from 'nodemailer';
import { IEmailProvider } from './email.provider.interface';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

export class SmtpEmailProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Port 465 uses direct SSL (secure: true).
    // Port 587 uses STARTTLS (secure: false, requireTLS: true).
    const isPort465 = Number(env.SMTP_PORT) === 465;
    const isSecure = isPort465 || env.SMTP_SECURE === true;

    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: isSecure,
      requireTLS: !isSecure, // enforce STARTTLS on port 587
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection configuration asynchronously
    this.transporter.verify((error, success) => {
      if (error) {
        logger.error('SMTP Connection Verify Error:', error.message);
      } else {
        logger.info('SMTP Server is verified and ready to send messages');
      }
    });
  }

  async sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        html: htmlBody,
      });
      logger.info(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    } catch (error: any) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }
}
