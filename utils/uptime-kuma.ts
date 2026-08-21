const UPTIME_KUMA_STATUS: Record<number, string> = {
  0: 'DOWN',
  1: 'UP',
  2: 'PENDING',
  3: 'MAINTENANCE',
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
}

export function parseUptimeKumaNotification(payload: Record<string, unknown>): {
  title: string;
  body: string;
} {
  const heartbeat = asRecord(payload.heartbeat ?? payload.heartbeatJSON);
  const monitor = asRecord(payload.monitor ?? payload.monitorJSON);

  const monitorName =
    typeof monitor?.name === 'string' && monitor.name ? monitor.name : 'Uptime Kuma';
  const statusCode = typeof heartbeat?.status === 'number' ? heartbeat.status : undefined;
  const statusLabel =
    statusCode !== undefined ? UPTIME_KUMA_STATUS[statusCode] : undefined;

  const title = statusLabel ? `${monitorName} [${statusLabel}]` : monitorName;
  const body =
    (typeof payload.msg === 'string' && payload.msg) ||
    (typeof heartbeat?.msg === 'string' && heartbeat.msg) ||
    'Status update';

  return { title, body };
}
