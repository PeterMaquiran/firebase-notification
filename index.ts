import 'dotenv/config';
import admin from 'firebase-admin';
import type { Message } from 'firebase-admin/messaging';

// If /vault/secrets/serviceAccountKey.json is missing or unreadable,
// Firebase Admin will throw an unhandled Error and crash Node.js immediately.
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const registrationToken =
  'f6RnUAZijupKkpngRrJ7UP:APA91bFnYlxQLcO6vXZXK5NGCmuuQhi2rtEhH8g1LufGiNwqiTMRDa06ySzn6SjIFK-3rWh9rm04xAkFQ4xpg4Jm9lnEL71KYNqGE07Pc3rnpeHd9X4cbGY';

const message: Message = {
  notification: {
    title: 'Notification Title',
    body: 'This is the body of the notification.',
  },
  webpush: {
    notification: {
      badge:
        'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg',
      icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg',
    },
  },
  token: registrationToken,
};

admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error: unknown) => {
    console.error('Error sending message:', error);
    process.exit(1); // Force exit on failure
  });