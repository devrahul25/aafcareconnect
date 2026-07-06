import morgan from 'morgan';
import { env } from '../config/env';

// Define log format based on environment
const format = env.NODE_ENV === 'development' ? 'dev' : 'combined';

// Export morgan middleware
export const requestLogger = morgan(format);
