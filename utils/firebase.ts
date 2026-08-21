import admin from 'firebase-admin';

export function initFirebase(): void {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    process.exit(1);
  }
}

export function isFirebaseReady(): boolean {
  return admin.apps.length > 0;
}

export { admin };
