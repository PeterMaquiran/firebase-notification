import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import admin from 'firebase-admin';
import type { Message } from 'firebase-admin/messaging';

// 1. Fail fast on boot if Vault credentials are missing/invalid
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log('Firebase Admin initialized successfully.');
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  process.exit(1); // Crash container so Swarm handles restart
}

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 2. Health Check Endpoint for Docker / Swarm / Load Balancer
app.get('/health', (_req: Request, res: Response) => {
  // Verifies Firebase app is initialized
  if (admin.apps.length > 0) {
    res.status(200).json({ status: 'UP', firebase: 'connected' });
  } else {
    res.status(503).json({ status: 'DOWN', firebase: 'disconnected' });
  }
});

// 3. API Endpoint to Send Push Notifications
app.post('/send-notification', async (req: Request, res: Response) => {
  try {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
      res.status(400).json({ error: 'Missing required fields: token, title, body' });
      return;
    }

    const message: Message = {
      notification: { title, body },
      webpush: {
        notification: {
          badge: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg',
          icon: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg',
        },
      },
      token,
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error: unknown) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});