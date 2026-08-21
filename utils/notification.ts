import type { Message } from 'firebase-admin/messaging';
import { admin } from './firebase.js';

export const WEBPUSH_ICON =
  'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg';
export const DEFAULT_BROADCAST_TOPIC = 'all';
export const FCM_DEVICE_TOKEN = process.env.FCM_DEVICE_TOKEN;

export function notificationPayload(title: string, body: string) {
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

export async function sendToToken(
  token: string,
  title: string,
  body: string,
): Promise<string> {
  const message: Message = {
    ...notificationPayload(title, body),
    token,
  };
  return admin.messaging().send(message);
}

export async function sendToTopic(
  topic: string,
  title: string,
  body: string,
): Promise<string> {
  const message: Message = {
    ...notificationPayload(title, body),
    topic,
  };
  return admin.messaging().send(message);
}
