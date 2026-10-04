"use client";

import { useEffect, useState } from "react";
import type { AuditEvent } from "../lib/audit-log";

export function EventStream() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [lastRunMs, setLastRunMs] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/audit", { cache: "no-store" });
        const data = (await res.json()) as {
          events: AuditEvent[];
          lastRunMs: number;
        };
        if (!cancelled) {
          setEvents(data.events ?? []);
          setLastRunMs(data.lastRunMs ?? 0);
        }
      } catch {
        /* ignore while the server warms */
      }
    };
    tick();
    const id = setInterval(tick, 1200);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">Live AG-UI event stream</h3>
        <p className="text-xs text-[var(--muted)]">
          last run {lastRunMs ? `${lastRunMs}ms` : "—"} · AuditMiddleware
        </p>
      </div>
      <div className="max-h-56 overflow-auto font-mono text-[11px] leading-5">
        {events.length === 0 ? (
          <p className="text-[var(--muted)]">
            Ask the copilot something. Middleware will log RUN_STARTED,
            TEXT_MESSAGE_*, TOOL_CALL_*, and A2UI events here.
          </p>
        ) : (
          events.slice(0, 40).map((event, i) => (
            <div
              key={`${event.ts}-${i}`}
              className="grid grid-cols-[88px_1fr] gap-2 border-b border-[var(--line)] py-1"
            >
              <span className="text-[var(--accent)]">{event.type}</span>
              <span className="truncate text-[var(--muted)]">
                {event.agentId} {event.detail ?? ""}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
