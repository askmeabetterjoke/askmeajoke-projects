export type AuditEvent = {
  ts: number;
  runId: string;
  agentId?: string;
  type: string;
  detail?: string;
};

const MAX = 120;
let events: AuditEvent[] = [];
let lastRunMs = 0;

export function pushAudit(event: AuditEvent) {
  events = [event, ...events].slice(0, MAX);
}

export function markRunDuration(ms: number) {
  lastRunMs = ms;
}

export function getAuditSnapshot() {
  return { events, lastRunMs, count: events.length };
}

export function resetAudit() {
  events = [];
  lastRunMs = 0;
}
