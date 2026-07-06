import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file if present
dotenv.config();

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().url(),
  API_URL: z.string().url().optional(),

  // Database
  DATABASE_URL: z.string().url(),

  // Firebase Authentication
  FIREBASE_API_KEY: z.string().min(1).optional(),
  FIREBASE_AUTH_DOMAIN: z.string().min(1).optional(),

  // Firebase Admin SDK
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(), // Fallback if using file

  // AWS S3
  AWS_REGION: z.string().default('eu-west-2'),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),

  // CloudFront
  AWS_CLOUDFRONT_DOMAIN: z.string().min(1),
  AWS_CLOUDFRONT_KEY_PAIR_ID: z.string().min(1).optional(),
  AWS_CLOUDFRONT_PRIVATE_KEY: z.string().min(1).optional(),

  // JWT & Authentication
  JWT_SECRET: z.string().min(32).optional(), // Optional for now until custom JWT is built
  JWT_EXPIRES_IN: z.string().default('7d'),
  OTP_SECRET: z.string().min(32),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('\n======================================');
  console.error('❌ Environment Validation Failed');
  console.error('======================================\n');
  _env.error.issues.forEach(issue => {
    console.error(`❌ ${issue.path.join('.')}: ${issue.message}`);
  });
  console.error('\nPlease check your .env file or environment variables.\n');
  process.exit(1);
}

export const env = _env.data;
