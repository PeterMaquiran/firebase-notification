import admin, { type ServiceAccount } from 'firebase-admin';
import type { Message } from 'firebase-admin/messaging';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to your Firebase service account JSON file
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8')
) as ServiceAccount;

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// The device registration token from the client FCM SDKs
const registrationToken =
  'f6RnUAZijupKkpngRrJ7UP:APA91bFnYlxQLcO6vXZXK5NGCmuuQhi2rtEhH8g1LufGiNwqiTMRDa06ySzn6SjIFK-3rWh9rm04xAkFQ4xpg4Jm9lnEL71KYNqGE07Pc3rnpeHd9X4cbGY';

// Define the notification message payload
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

// Send the message
admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error: unknown) => {
    console.error('Error sending message:', error);
  });
