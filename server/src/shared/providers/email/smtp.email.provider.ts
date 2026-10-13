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
      let lineBuffer = '';
      let isResolved = false;

      const cleanup = () => {
        if (socket && !socket.destroyed) {
          socket.destroy();
        }
      };

      const handleLine = (line: string) => {
        if (!line) return;
        logger.debug(`[SMTP ${state}] S: ${line}`);

        if (state === 'INIT' && line.startsWith('220')) {
          if (isPort465) {
            state = 'EHLO';
            socket.write('EHLO aafcareconnect.com\r\n');
          } else {
            state = 'STARTTLS_EHLO';
            socket.write('EHLO aafcareconnect.com\r\n');
          }
        } else if (state === 'STARTTLS_EHLO' && line.startsWith('250 ')) {
          state = 'STARTTLS_CMD';
          socket.write('STARTTLS\r\n');
        } else if (state === 'STARTTLS_CMD' && line.startsWith('220')) {
          state = 'EHLO';
          const tlsSocket = tls.connect({
            socket,
            rejectUnauthorized: false,
            servername: host
          });
          socket = tlsSocket;
          tlsSocket.on('data', onData);
          tlsSocket.on('error', (err: any) => {
            if (!isResolved) {
              isResolved = true;
              cleanup();
              reject(err);
            }
          });
          tlsSocket.write('EHLO aafcareconnect.com\r\n');
        } else if (state === 'EHLO' && line.startsWith('250 ')) {
          state = 'AUTH_USER';
          socket.write('AUTH LOGIN\r\n');
        } else if (state === 'AUTH_USER' && line.startsWith('334')) {
          state = 'AUTH_PASS';
          socket.write(Buffer.from(user).toString('base64') + '\r\n');
        } else if (state === 'AUTH_PASS' && line.startsWith('334')) {
          state = 'AUTH_CHECK';
          socket.write(Buffer.from(pass).toString('base64') + '\r\n');
        } else if (state === 'AUTH_CHECK' && line.startsWith('235')) {
          state = 'MAIL_FROM';
          socket.write(`MAIL FROM:<${fromEmail}>\r\n`);
        } else if (state === 'MAIL_FROM' && line.startsWith('250')) {
          state = 'RCPT_TO';
          socket.write(`RCPT TO:<${to}>\r\n`);
        } else if (state === 'RCPT_TO' && line.startsWith('250')) {
          state = 'DATA';
          socket.write('DATA\r\n');
        } else if (state === 'DATA' && line.startsWith('354')) {
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
        } else if (state === 'BODY' && line.startsWith('250')) {
          state = 'DONE';
          logger.info(`Email sent successfully to ${to} via SMTP (Port ${port})`);
          socket.write('QUIT\r\n');
          socket.end();
          if (!isResolved) {
            isResolved = true;
            resolve();
          }
        } else if (line.startsWith('5')) {
          logger.error(`SMTP Error from server in state ${state}: ${line}`);
          cleanup();
          if (!isResolved) {
            isResolved = true;
            reject(new Error(line.trim()));
          }
        }
      };

      const onData = (chunk: Buffer) => {
        lineBuffer += chunk.toString();
        const lines = lineBuffer.split('\r\n');
        lineBuffer = lines.pop() || '';
        for (const line of lines) {
          handleLine(line);
        }
      };

      if (isPort465) {
        socket = tls.connect(port, host, { rejectUnauthorized: false, servername: host }, () => {
          logger.debug(`Connected to ${host}:${port} via SSL`);
        });
      } else {
        socket = net.createConnection(port, host, () => {
          logger.debug(`Connected to ${host}:${port} via STARTTLS`);
        });
      }

      socket.on('data', onData);
      socket.on('error', (err: any) => {
        logger.error('SMTP Socket error:', err);
        if (!isResolved) {
          isResolved = true;
          cleanup();
          reject(err);
        }
      });

      socket.setTimeout(15000, () => {
        cleanup();
        if (!isResolved) {
          isResolved = true;
          reject(new Error('SMTP Connection Timeout'));
        }
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
