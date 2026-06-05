export interface WebhookEvent {
  eventId: string;
  event: string;
  timestamp: Date;
  resource: { kind: string; id: string };
  data: Record<string, unknown>;
}

const MAX_EVENTS = 100;
const events: WebhookEvent[] = [];

export function addEvent(event: WebhookEvent): void {
  events.unshift(event);
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;
}

export function getEvents(): WebhookEvent[] {
  return [...events];
}
