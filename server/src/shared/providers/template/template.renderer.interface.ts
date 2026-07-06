export interface ITemplateRenderer {
  /**
   * Renders a template with the provided data context
   * @param templateName The identifier or path of the template
   * @param context The data object to inject into the template
   * @returns The rendered HTML string
   */
  render(templateName: string, context: Record<string, any>): string;
}
