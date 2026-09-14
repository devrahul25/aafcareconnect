import net from 'net';
import tls from 'tls';
import { IEmailProvider } from './email.provider.interface';
import { env } from '../../../config/env';
import { logger } from '../../../config/logger';

export class SmtpEmailProvider implements IEmailProvider {
  private sendViaSmtp(to: string, subject: string, htmlBody: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const host = env.SMTP_HOST || 'smtp.zoho.eu';
      const port = Number(env.SMTP_PORT) || 465;
      const isPort465 = port === 465;
      const user = env.SMTP_USER || 'no-reply@aafcareconnect.com';
      const pass = env.SMTP_PASS || '';
      const fromEmail = env.SMTP_FROM_EMAIL || user;
      const fromName = env.SMTP_FROM_NAME || 'AAF CareConnect';

      let socket: any;
      let state = 'INIT';
      let authStarted = false;

      function handleData(data: Buffer) {
        const msg = data.toString();

        if (state === 'INIT' && msg.startsWith('220')) {
          state = isPort465 ? 'EHLO' : 'STARTTLS_EHLO';
          socket.write('EHLO aafcareconnect.com\r\n');
        } else if (state === 'STARTTLS_EHLO' && (msg.startsWith('250-') || msg.startsWith('250 '))) {
          state = 'STARTTLS_CMD';
          socket.write('STARTTLS\r\n');
        } else if (state === 'STARTTLS_CMD' && msg.startsWith('220')) {
          // Upgrade plain socket to TLS on Port 587
          state = 'EHLO';
          const tlsSocket = tls.connect({
            socket,
            rejectUnauthorized: false,
            servername: host
          });
          socket = tlsSocket;
          tlsSocket.on('data', handleData);
          tlsSocket.on('error', (err) => reject(err));
          tlsSocket.write('EHLO aafcareconnect.com\r\n');
        } else if (state === 'EHLO' && (msg.startsWith('250-') || msg.startsWith('250 '))) {
          if (!authStarted) {
            authStarted = true;
            state = 'AUTH_LOGIN';
            socket.write('AUTH LOGIN\r\n');
          }
        } else if (state === 'AUTH_LOGIN' && (msg.startsWith('334 VXNlcm5hbWU6') || msg.toLowerCase().includes('username'))) {
          state = 'AUTH_USER';
          socket.write(Buffer.from(user).toString('base64') + '\r\n');
        } else if (state === 'AUTH_USER' && (msg.startsWith('334 UGFzc3dvcmQ6') || msg.toLowerCase().includes('password'))) {
          state = 'AUTH_PASS';
          socket.write(Buffer.from(pass).toString('base64') + '\r\n');
        } else if (state === 'AUTH_PASS' && msg.startsWith('235')) {
          state = 'MAIL_FROM';
          socket.write(`MAIL FROM:<${fromEmail}>\r\n`);
        } else if (state === 'MAIL_FROM' && msg.startsWith('250')) {
          state = 'RCPT_TO';
          socket.write(`RCPT TO:<${to}>\r\n`);
        } else if (state === 'RCPT_TO' && msg.startsWith('250')) {
          state = 'DATA';
          socket.write('DATA\r\n');
        } else if (state === 'DATA' && msg.startsWith('354')) {
          state = 'BODY';
          const emailContent = [
            `From: "${fromName}" <${fromEmail}>`,
            `To: ${to}`,
            `Subject: ${subject}`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            '',
            htmlBody,
            '',
            '.'
          ].join('\r\n');
          socket.write(emailContent + '\r\n');
        } else if (state === 'BODY' && msg.startsWith('250')) {
          logger.info(`Email sent successfully to ${to} via SMTP (Port ${port})`);
          socket.write('QUIT\r\n');
          socket.end();
          resolve();
        } else if (msg.startsWith('5')) {
          logger.error(`SMTP Error from server: ${msg}`);
          socket.end();
          reject(new Error(msg.trim()));
        }
      }

      if (isPort465) {
        socket = tls.connect(port, host, { rejectUnauthorized: false, servername: host }, () => {
          logger.debug(`Connected to ${host}:${port} via SSL`);
        });
      } else {
        socket = net.createConnection(port, host, () => {
          logger.debug(`Connected to ${host}:${port} via STARTTLS`);
        });
      }

      socket.on('data', handleData);
      socket.on('error', (err: any) => {
        logger.error('SMTP Socket error:', err);
        reject(err);
      });

      socket.setTimeout(15000, () => {
        socket.destroy();
        reject(new Error('SMTP Connection Timeout'));
      });
    });
  }

  async sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
    try {
      await this.sendViaSmtp(to, subject, htmlBody);
    } catch (error: any) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }
}
