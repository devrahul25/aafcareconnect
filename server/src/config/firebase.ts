import * as admin from 'firebase-admin';
import { env } from './env';
import { logger } from './logger';

try {
  let credential;

  // Use explicit email/key if provided (best for containerized environments)
  if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    credential = admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      // Replace literal \n with actual newlines if they are escaped in env string
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  } 
  // Otherwise rely on GOOGLE_APPLICATION_CREDENTIALS or default provider
  else {
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    projectId: env.FIREBASE_PROJECT_ID,
  });
  logger.info('Firebase Admin initialized successfully');
} catch (error) {
  logger.error('Failed to initialize Firebase Admin:', error);
}

export const firebaseAuth = admin.auth();
