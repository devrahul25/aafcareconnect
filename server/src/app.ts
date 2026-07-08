import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { logger } from './config/logger';
import { requestLogger } from './middleware/requestLogger';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import { v1Routes } from './routes/v1';
import { prisma } from './config/database';

export const app = express();

// 1. Security & utility middlewares
app.use(requestIdMiddleware);
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(cors({
  origin: (origin, callback) => {
    if (env.NODE_ENV === 'development') {
      if (!origin || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
    }
    if (origin === env.FRONTEND_URL || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
  message: { success: false, error: { type: 'RATE_LIMIT', message: 'Too many requests' } },
});
app.use('/api', globalLimiter);

// 2. Request logging
app.use(requestLogger);

// 3. API Routes
app.use('/api/v1', v1Routes);

// 4. 404 Handler
app.use(notFoundHandler);

// 5. Global Error Handler
app.use(errorHandler);


