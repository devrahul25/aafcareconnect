import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { ITemplateRenderer } from './template.renderer.interface';
import { logger } from '../../../config/logger';

const INLINE_FALLBACK_TEMPLATES: Record<string, string> = {
  'password-reset-email': `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; background-color: #ffffff; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0;">Password Reset Request</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 5px;">AAF CareConnect Security</p>
      </div>
      <p style="color: #334155; font-size: 15px;">Hello {{name}},</p>
      <p style="color: #334155; font-size: 14px; line-height: 1.5;">We received a request to reset the password for your AAF CareConnect account. Use the 6-digit verification code below to set your new password:</p>
      <div style="text-align: center; margin: 30px 0; background-color: #f8fafc; padding: 20px; border-radius: 12px; border: 1px dashed #cbd5e1;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; font-family: monospace;">{{code}}</span>
      </div>
      <p style="color: #64748b; font-size: 13px; line-height: 1.4;">This verification code is valid for <strong>15 minutes</strong> and can only be used once.</p>
      <p style="color: #64748b; font-size: 13px; line-height: 1.4;">If you did not request a password reset, please disregard this message or contact support if you suspect unauthorized access.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">© AAF CareConnect. All rights reserved.</p>
    </div>
  `,
  'verification-email': `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Verify your email address</h2>
      <p>Hello {{name}},</p>
      <p>Thank you for registering. Please use the verification code below to complete your registration:</p>
      <h1 style="letter-spacing: 5px; color: #4F46E5;">{{code}}</h1>
      <p>This code will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `,
  'staff-welcome': `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 5px; }
            .credentials { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Welcome to AAF CareConnect</h2>
            </div>
            <div class="content">
                <p>Hello {{name}},</p>
                <p>You have been invited to join <strong>{{organization}}</strong>.</p>
                <div class="credentials">
                    <p><strong>Role:</strong><br>{{role}}</p>
                    <p><strong>Organisation:</strong><br>{{organization}}</p>
                    <p><strong>Email:</strong><br>{{email}}</p>
                    <p><strong>Temporary Password:</strong><br>{{temp_password}}</p>
                </div>
                <p>Please use these credentials to login and set up your account. You will be required to change your password after your first login.</p>
                <p style="text-align: center; margin-top: 30px;">
                    <a href="{{login_url}}" class="button">Login to your account</a>
                </p>
            </div>
            <div class="footer">
                <p>This is an automated message from AAF CareConnect. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `,
  'learner-welcome': `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 5px; }
            .credentials { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Welcome to AAF CareConnect</h2>
            </div>
            <div class="content">
                <p>Hello {{first_name}},</p>
                <p>Welcome to AAF CareConnect. Your learner account has been created.</p>
                <div class="credentials">
                    <p><strong>Email:</strong><br>{{email}}</p>
                    <p><strong>Temporary Password:</strong><br>{{temp_password}}</p>
                </div>
                <p>Please use these credentials to login and access your training courses.</p>
                <p style="text-align: center; margin-top: 30px;">
                    <a href="{{login_url}}" class="button">Access Platform</a>
                </p>
            </div>
            <div class="footer">
                <p>This is an automated message from AAF CareConnect. Please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
  `
};

export class HandlebarsRenderer implements ITemplateRenderer {
  private templates: Record<string, HandlebarsTemplateDelegate> = {};

  private getPossibleTemplatePaths(templateName: string): string[] {
    return [
      path.join(__dirname, 'templates', `${templateName}.hbs`),
      path.join(process.cwd(), 'dist', 'shared', 'providers', 'template', 'templates', `${templateName}.hbs`),
      path.join(process.cwd(), 'src', 'shared', 'providers', 'template', 'templates', `${templateName}.hbs`),
      path.join(process.cwd(), 'server', 'dist', 'shared', 'providers', 'template', 'templates', `${templateName}.hbs`),
      path.join(process.cwd(), 'server', 'src', 'shared', 'providers', 'template', 'templates', `${templateName}.hbs`),
      path.resolve(__dirname, '../../../../src/shared/providers/template/templates', `${templateName}.hbs`),
    ];
  }

  private loadTemplate(templateName: string): HandlebarsTemplateDelegate {
    if (this.templates[templateName]) {
      return this.templates[templateName];
    }

    const candidatePaths = this.getPossibleTemplatePaths(templateName);

    for (const templatePath of candidatePaths) {
      if (fs.existsSync(templatePath)) {
        try {
          const source = fs.readFileSync(templatePath, 'utf8');
          const compiled = Handlebars.compile(source);
          this.templates[templateName] = compiled;
          return compiled;
        } catch (readErr) {
          logger.warn(`Failed reading template at ${templatePath}:`, readErr);
        }
      }
    }

    // Fallback to inline template if available
    if (INLINE_FALLBACK_TEMPLATES[templateName]) {
      logger.info(`Using inline fallback template for ${templateName}`);
      const compiled = Handlebars.compile(INLINE_FALLBACK_TEMPLATES[templateName]);
      this.templates[templateName] = compiled;
      return compiled;
    }

    logger.error(`Template ${templateName} not found in any path: ${candidatePaths.join(', ')}`);
    throw new Error(`Template ${templateName} not found or could not be loaded.`);
  }

  render(templateName: string, context: Record<string, any>): string {
    const template = this.loadTemplate(templateName);
    return template(context);
  }
}
