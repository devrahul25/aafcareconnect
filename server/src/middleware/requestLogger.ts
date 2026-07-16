import morgan from 'morgan';
import { env } from '../config/env';

// Define log format based on environment
const format = env.NODE_ENV === 'development' ? 'dev' : 'combined';

// Export morgan middleware
export const requestLogger = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const log = [
    tokens.method(req, res),
    tokens.url(req, res),
    status,
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ');

  const numericStatus = status ? parseInt(status, 10) : 0;
  if (numericStatus >= 400 && numericStatus < 600) {
    console.error(`ERROR REQUEST BODY: ${JSON.stringify((req as any).body)}`);
  }
  return log;
});
