import { IEmailProvider } from './email.provider.interface';
import { ITemplateRenderer } from '../template/template.renderer.interface';
import { HandlebarsRenderer } from '../template/handlebars.renderer';
import { MockEmailProvider } from './mock.email.provider';
import { SmtpEmailProvider } from './smtp.email.provider';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

export class EmailService {
  private provider: IEmailProvider;
  private renderer: ITemplateRenderer;

  constructor(provider?: IEmailProvider, renderer?: ITemplateRenderer) {
    this.renderer = renderer || new HandlebarsRenderer();
    
    if (provider) {
      this.provider = provider;
    } else if (env.SMTP_HOST) {
      this.provider = new SmtpEmailProvider();
    } else {
      this.provider = new MockEmailProvider();
      if (env.NODE_ENV === 'production') {
        logger.warn('EmailService instantiated without a production provider or SMTP configuration! Falling back to Mock.');
      }
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

  async sendOrganizationWelcomeEmail(to: string, data: { name: string, admin_name: string, temp_password: string, org_id: string }): Promise<void> {
    try {
      // In a real app we'd have a Handlebars template for this, 
      // but for now we can render a simple HTML string to replace the direct nodemailer usage
      const loginUrl = env.FRONTEND_URL ? `${env.FRONTEND_URL}/login` : 'https://app.aafcareconnect.com/login';
      const htmlBody = `<h3>Hello ${data.admin_name},</h3>
        <p>Your organisation has been successfully created.</p>
        <ul>
          <li><b>Organisation:</b> ${data.name}</li>
          <li><b>Organisation ID:</b> ${data.org_id}</li>
          <li><b>Email:</b> ${to}</li>
          <li><b>Temporary Password:</b> ${data.temp_password}</li>
        </ul>
        <p><a href="${loginUrl}">Click here to Login</a></p>
        <p><i>For security, you will be required to change your password after your first login.</i></p>`;
        
      await this.provider.sendEmail(to, 'Welcome to AAF CareConnect', htmlBody);
    } catch (error) {
      logger.error(`Failed to send organization welcome email to ${to}`, error);
      throw error;
    }
  }
}
