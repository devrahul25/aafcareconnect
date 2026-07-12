import { IEmailProvider } from './email.provider.interface';
import { ITemplateRenderer } from '../template/template.renderer.interface';
import { HandlebarsRenderer } from '../template/handlebars.renderer';
import { MockEmailProvider } from './mock.email.provider';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

export class EmailService {
  private provider: IEmailProvider;
  private renderer: ITemplateRenderer;

  constructor(provider?: IEmailProvider, renderer?: ITemplateRenderer) {
    // Default to mock in development, or inject real provider
    this.provider = provider || new MockEmailProvider();
    this.renderer = renderer || new HandlebarsRenderer();
    
    if (env.NODE_ENV === 'production' && !provider) {
      logger.warn('EmailService instantiated without a production provider! Falling back to Mock.');
    }
  }

  /**
   * Orchestrates the template rendering and email dispatch
   */
  async sendVerificationEmail(to: string, name: string, code: string): Promise<void> {
    try {
      const htmlBody = this.renderer.render('verification-email', { name, code });
      await this.provider.sendEmail(to, 'Verify your email address', htmlBody);
    } catch (error) {
      logger.error(`Failed to send verification email to ${to}`, error);
      throw error;
    }
  }
  async sendPasswordResetEmail(to: string, name: string, code: string): Promise<void> {
    try {
      const htmlBody = this.renderer.render('password-reset-email', { name, code });
      await this.provider.sendEmail(to, 'Password Reset Request', htmlBody);
    } catch (error) {
      logger.error(`Failed to send password reset email to ${to}`, error);
      throw error;
    }
  }

  async sendLearnerWelcomeEmail(to: string, data: any): Promise<void> {
    try {
      const htmlBody = this.renderer.render('learner-welcome', {
        ...data,
        email: to,
        login_url: env.FRONTEND_URL ? `${env.FRONTEND_URL}/login` : 'https://app.aafcareconnect.com/login'
      });
      await this.provider.sendEmail(to, 'Welcome to AAF CareConnect', htmlBody);
    } catch (error) {
      logger.error(`Failed to send learner welcome email to ${to}`, error);
      throw error;
    }
  }

  async sendStaffWelcomeEmail(to: string, data: { name: string, organization: string, role: string, temp_password: string }): Promise<void> {
    try {
      const htmlBody = this.renderer.render('staff-welcome', {
        ...data,
        email: to,
        login_url: env.FRONTEND_URL ? `${env.FRONTEND_URL}/login` : 'https://app.aafcareconnect.com/login'
      });
      await this.provider.sendEmail(to, 'Welcome to AAF CareConnect', htmlBody);
    } catch (error) {
      logger.error(`Failed to send staff welcome email to ${to}`, error);
      throw error;
    }
  }
}
