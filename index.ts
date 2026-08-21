import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import admin from 'firebase-admin';
import type { Message } from 'firebase-admin/messaging';

const WEBPUSH_ICON =
  'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg';
const DEFAULT_BROADCAST_TOPIC = 'all';

try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log('Firebase Admin initialized successfully.');
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  process.exit(1);
}

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

function notificationPayload(title: string, body: string) {
  return {
    notification: { title, body },
    webpush: {
      notification: {
        badge: WEBPUSH_ICON,
        icon: WEBPUSH_ICON,
      },
    },
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

app.get('/health', (_req: Request, res: Response) => {
  if (admin.apps.length > 0) {
    res.status(200).json({ status: 'UP', firebase: 'connected' });
  } else {
    res.status(503).json({ status: 'DOWN', firebase: 'disconnected' });
  }
});

// Send a notification to a single device token
app.post('/api/v1/notifications', async (req: Request, res: Response) => {
  try {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: token, title, body',
      });
      return;
    }

    const message: Message = {
      ...notificationPayload(title, body),
      token,
    };

    const messageId = await admin.messaging().send(message);
    res.status(200).json({ success: true, data: { messageId } });
  } catch (error: unknown) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error: errorMessage(error) });
  }
});

// Broadcast to every device subscribed to an FCM topic (defaults to "all")
app.post('/api/v1/notifications/broadcast', async (req: Request, res: Response) => {
  try {
    const { title, body, topic } = req.body;

    if (!title || !body) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: title, body',
      });
      return;
    }

    const targetTopic =
      typeof topic === 'string' && topic ? topic : DEFAULT_BROADCAST_TOPIC;

    const message: Message = {
      ...notificationPayload(title, body),
      topic: targetTopic,
    };

    const messageId = await admin.messaging().send(message);
    res.status(200).json({
      success: true,
      data: { messageId, topic: targetTopic },
    });
  } catch (error: unknown) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ success: false, error: errorMessage(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});