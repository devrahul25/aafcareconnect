export interface IEmailProvider {
  /**
   * Dispatches an email to the specified recipient
   * @param to The recipient email address
   * @param subject The email subject line
   * @param htmlBody The rendered HTML body
   */
  sendEmail(to: string, subject: string, htmlBody: string): Promise<void>;
}
