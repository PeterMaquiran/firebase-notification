import admin from 'firebase-admin';
import { logger } from './logger.js';

export function initFirebase(): void {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    logger.info('Firebase Admin initialized successfully');
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to initialize Firebase Admin');
    process.exit(1);
  }
}

export function isFirebaseReady(): boolean {
  return admin.apps.length > 0;
}

export { admin };
