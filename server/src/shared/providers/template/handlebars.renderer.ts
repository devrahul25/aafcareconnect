import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { ITemplateRenderer } from './template.renderer.interface';
import { logger } from '../../../config/logger';

export class HandlebarsRenderer implements ITemplateRenderer {
  private templates: Record<string, HandlebarsTemplateDelegate> = {};
  private templatesDir: string;

  constructor() {
    this.templatesDir = path.join(__dirname, 'templates');
  }

  private loadTemplate(templateName: string): HandlebarsTemplateDelegate {
    if (this.templates[templateName]) {
      return this.templates[templateName];
    }

    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      const source = fs.readFileSync(templatePath, 'utf8');
      const compiled = Handlebars.compile(source);
      this.templates[templateName] = compiled;
      return compiled;
    } catch (error) {
      logger.error(`Failed to load template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found or could not be loaded.`);
    }
  }

  render(templateName: string, context: Record<string, any>): string {
    const template = this.loadTemplate(templateName);
    return template(context);
  }
}
