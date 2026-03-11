import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to your Firebase service account JSON file
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'serviceAccountKey.json'), 'utf8')
);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// The device registration token from the client FCM SDKs
const registrationToken = 'dUahAEOM6Eo-jTAz9Vy6ZO:APA91bG5WVk1PrUi0g186UhZVRSjz9dgfPA4DVcvUw29kp3Tu_9BwSKUuWSesSlsx0KTKkBYbTGI8DYWGZWXkNkrLy4zdDHHUQ4iN3uW35JKzfecQW13sZE';

// Define the notification message payload
const message = {
  notification: {
    title: 'Notification Title',
    body: 'This is the body of the notification.',
  },
  token: registrationToken, // Target the specific device
};

// Send the message
admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.error('Error sending message:', error);
  });
