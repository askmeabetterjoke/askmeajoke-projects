import {
  Middleware,
  EventType,
  type AbstractAgent,
  type BaseEvent,
  type RunAgentInput,
} from "@ag-ui/client";
import { Observable } from "rxjs";
import { markRunDuration, pushAudit } from "../lib/audit-log";

export class AuditMiddleware extends Middleware {
  constructor(private agentId: string) {
    super();
  }

  run(input: RunAgentInput, next: AbstractAgent): Observable<BaseEvent> {
    const started = Date.now();
    pushAudit({
      ts: started,
      runId: input.runId,
      agentId: this.agentId,
      type: "RUN_QUEUED",
      detail: `${input.messages.at(-1)?.role ?? "unknown"} → ${this.agentId}`,
    });

    return new Observable<BaseEvent>((subscriber) => {
      const sub = this.runNextWithState(input, next).subscribe({
        next: ({ event }) => {
          const detail =
            "delta" in event && typeof event.delta === "string"
              ? event.delta.slice(0, 80)
              : "toolCallName" in event && typeof event.toolCallName === "string"
                ? event.toolCallName
                : undefined;
          if (event.type === EventType.RUN_ERROR) {
            const msg =
              "message" in event && typeof event.message === "string"
                ? event.message
                : detail;
            console.error(
              `[agui-studio/${this.agentId}] ${msg ?? "Agent run failed"}`,
            );
          }
          pushAudit({
            ts: Date.now(),
            runId: input.runId,
            agentId: this.agentId,
            type: event.type,
            detail:
              event.type === EventType.RUN_ERROR &&
              "message" in event &&
              typeof event.message === "string"
                ? event.message.slice(0, 200)
                : detail,
          });
          subscriber.next(event);
        },
        error: (err) => {
          pushAudit({
            ts: Date.now(),
            runId: input.runId,
            agentId: this.agentId,
            type: EventType.RUN_ERROR,
            detail: err instanceof Error ? err.message : String(err),
          });
          subscriber.error(err);
        },
        complete: () => {
          markRunDuration(Date.now() - started);
          subscriber.complete();
        },
      });
      return () => sub.unsubscribe();
    });
  }
}

const SPEND_POLICY = {
  description: "Northwind spend policy injected by PolicyMiddleware",
  value: {
    role: "finance-ops",
    approvalRequiredOver: 10000,
    overLimitNeedsReview: true,
    blockedTools: ["wipeLedger"],
    user: "Alex Morgan",
  },
};

export class PolicyMiddleware extends Middleware {
  run(input: RunAgentInput, next: AbstractAgent): Observable<BaseEvent> {
    const nextInput: RunAgentInput = {
      ...input,
      context: [...(input.context ?? []), SPEND_POLICY],
      forwardedProps: {
        ...input.forwardedProps,
        policy: "northwind-finance-v1",
      },
    };

    return this.runNext(nextInput, next);
  }
}
