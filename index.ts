import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { errorMessage } from './utils/error.js';
import { initFirebase, isFirebaseReady } from './utils/firebase.js';
import {
  DEFAULT_BROADCAST_TOPIC,
  FCM_DEVICE_TOKEN,
  sendToToken,
  sendToTopic,
} from './utils/notification.js';
import { parseUptimeKumaNotification } from './utils/uptime-kuma.js';

initFirebase();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/health', (_req: Request, res: Response) => {
  if (isFirebaseReady()) {
    res.status(200).json({ status: 'UP', firebase: 'connected' });
  } else {
    res.status(503).json({ status: 'DOWN', firebase: 'disconnected' });
  }
});

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

    const messageId = await sendToToken(token, title, body);
    res.status(200).json({ success: true, data: { messageId } });
  } catch (error: unknown) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error: errorMessage(error) });
  }
});

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
    const messageId = await sendToTopic(targetTopic, title, body);

    res.status(200).json({
      success: true,
      data: { messageId, topic: targetTopic },
    });
  } catch (error: unknown) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ success: false, error: errorMessage(error) });
  }
});

app.post('/api/v1/notifications/uptime-kuma', async (req: Request, res: Response) => {
  try {
    if (!FCM_DEVICE_TOKEN) {
      res.status(503).json({
        success: false,
        error: 'FCM_DEVICE_TOKEN is not configured',
      });
      return;
    }

    const { title, body } = parseUptimeKumaNotification(req.body ?? {});
    const messageId = await sendToToken(FCM_DEVICE_TOKEN, title, body);
    res.status(200).json({ success: true, data: { messageId } });
  } catch (error: unknown) {
    console.error('Error sending Uptime Kuma notification:', error);
    res.status(500).json({ success: false, error: errorMessage(error) });
  }
});

app.listen(PORT, () => {
  if (!FCM_DEVICE_TOKEN) {
    console.warn(
      'FCM_DEVICE_TOKEN is not set; /api/v1/notifications/uptime-kuma will return 503.',
    );
  }
  console.log(`Server running on port ${PORT}`);
});
