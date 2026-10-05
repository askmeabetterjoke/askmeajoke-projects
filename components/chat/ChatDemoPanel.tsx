"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { ChevronRight, Play, Sparkles, X } from "lucide-react";
import {
  CHAT_DEMO_STEPS,
  DEMO_CAPABILITY_STYLES,
  type ChatDemoStep,
} from "../../lib/chat-demo-flow";
import { applyDryRunStep, preflightSteps } from "../../lib/demo-dry-run";
import { buildDemoUserContent } from "../../lib/demo-pdf-attachment";
import { trimAgentHistory } from "../../lib/trim-agent-history";
import { cn } from "../../lib/utils";
import { useFinance } from "../finance/FinanceProvider";
import { useChatDemo } from "./ChatDemoProvider";

function messageId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}`;
}

export function ChatDemoPanel() {
  const finance = useFinance();
  const demo = useChatDemo();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { copilotkit } = useCopilotKit();
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [runningPreflight, setRunningPreflight] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hitlHint, setHitlHint] = useState<string | null>(null);

  const analyticsAgent = useAgent({ agentId: "analytics" }).agent;
  const documentsAgent = useAgent({ agentId: "documents" }).agent;

  const runStep = useCallback(
    async (step: ChatDemoStep) => {
      setError(null);
      setHitlHint(null);
      setRunningId(step.id);
      demo.setActiveStepId(step.id);

      if (demo.dryRun) {
        try {
          applyDryRunStep(step, finance);
          await new Promise((r) => setTimeout(r, 200));
          demo.markCompleted(step.id);
        } finally {
          setRunningId(null);
        }
        return;
      }

      finance.setTab(step.tab);

      const agent =
        step.agent === "documents" ? documentsAgent : analyticsAgent;

      try {
        if (!agent) {
          throw new Error(
            `Agent "${step.agent}" is not ready. Start LangGraph (8123) and Agno (8000) if needed.`,
          );
        }

        if (step.requiresHitl) {
          setHitlHint(
            "When the approval card appears in chat, click Approve (or Deny) before starting the next step.",
          );
        }

        await new Promise((r) =>
          setTimeout(r, step.agent === "documents" ? 280 : 120),
        );

        trimAgentHistory(agent);
        if (step.agent === "documents" && analyticsAgent) {
          trimAgentHistory(analyticsAgent);
        }
        if (step.agent === "analytics" && documentsAgent) {
          trimAgentHistory(documentsAgent);
        }

        const content = await buildDemoUserContent(
          step.prompt,
          step.pdfFileName,
          { attachBinary: false },
        );

        agent.addMessage({
          id: messageId(),
          role: "user",
          content,
        });

        await copilotkit.runAgent({ agent });
        demo.markCompleted(step.id);
      } catch (err) {
        console.error("[chat-demo]", err);
        setError(err instanceof Error ? err.message : "Demo step failed.");
      } finally {
        setRunningId(null);
      }
    },
    [analyticsAgent, copilotkit, demo, documentsAgent, finance],
  );

  const runPreflight = useCallback(async () => {
    if (runningPreflight || runningId || runningAll) return;
    setRunningPreflight(true);
    setError(null);
    try {
      for (const step of preflightSteps(CHAT_DEMO_STEPS)) {
        await runStep(step);
        await new Promise((r) => setTimeout(r, 300));
      }
    } finally {
      setRunningPreflight(false);
    }
  }, [runStep, runningAll, runningId, runningPreflight]);

  const runAll = useCallback(async () => {
    if (runningAll || runningId) return;
    setRunningAll(true);
    setError(null);
    try {
      for (const step of CHAT_DEMO_STEPS) {
        await runStep(step);
        await new Promise((r) => setTimeout(r, 400));
      }
    } finally {
      setRunningAll(false);
    }
  }, [runStep, runningAll, runningId]);

  const busy =
    runningId !== null || runningAll || runningPreflight;

  return (
    <div
      className="flex h-full flex-col border-l border-[var(--line)] bg-[var(--bg)] shadow-xl"
      role="dialog"
      aria-label="Presenter demo flow"
    >
      <div className="flex items-start justify-between gap-2 border-b border-[var(--line)] px-4 py-3">
        <div>
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--ink)]">
            <Sparkles className="h-4 w-4" />
            Presenter demo
          </div>
          <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">
            {demo.dryRun
              ? "Dry run: switches tabs and filters only — no LLM calls."
              : "Live run: LangGraph agents on the server. Steps 7–10 need Approve in chat."}
          </p>
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-[11px] text-[var(--ink)]">
            <input
              type="checkbox"
              checked={demo.dryRun}
              onChange={(e) => {
                const checked = e.target.checked;
                demo.setDryRun(checked);
                const params = new URLSearchParams(searchParams.toString());
                if (checked) {
                  params.set("demo", "dry");
                } else {
                  params.delete("demo");
                }
                const qs = params.toString();
                router.replace(qs ? `${pathname}?${qs}` : pathname, {
                  scroll: false,
                });
              }}
              className="rounded border-[var(--line)]"
            />
            Dry run (no LLM)
          </label>
        </div>
        <button
          type="button"
          aria-label="Close demo"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--chip)]"
          onClick={() => demo.setDemoOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mx-4 mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[10px] leading-snug text-amber-950">
        <strong>Steps 7–10 (HITL):</strong> the run pauses until you click{" "}
        <strong>Approve</strong> or <strong>Deny</strong> on the card in the
        chat column. Budget ~30s per approval when presenting live.
      </div>

      {hitlHint ? (
        <p className="mx-4 mt-2 rounded-lg bg-violet-50 px-2 py-1.5 text-[11px] text-violet-900">
          {hitlHint}
        </p>
      ) : null}

      {error ? (
        <p className="mx-4 mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] text-red-800">
          {error}
        </p>
      ) : null}

      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {CHAT_DEMO_STEPS.map((step) => {
          const style = DEMO_CAPABILITY_STYLES[step.capability];
          const active = demo.activeStepId === step.id;
          const done = demo.completedStepIds.includes(step.id);
          const running = runningId === step.id;
          const hitl = step.requiresHitl;
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={busy}
                title={step.presenterNote}
                onClick={() => void runStep(step)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-xl px-2 py-1.5 text-left transition",
                  active ? "bg-[var(--chip)]" : "hover:bg-[var(--chip)]/60",
                  busy && !running && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                    done
                      ? "bg-[var(--ink)] text-white"
                      : "bg-white text-[var(--muted)] ring-1 ring-[var(--line)]",
                  )}
                >
                  {done ? "✓" : step.step}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1">
                    <span className="text-[12px] font-medium text-[var(--ink)]">
                      {step.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide",
                        style.bg,
                        style.text,
                      )}
                    >
                      {step.capabilityLabel}
                    </span>
                    {hitl ? (
                      <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-medium text-rose-900">
                        HITL
                      </span>
                    ) : null}
                    {step.pdfFileName ? (
                      <span className="text-[9px] text-[var(--muted)]">
                        PDF
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-[var(--muted)]">
                    {step.presenterNote}
                  </span>
                </span>
                {running ? (
                  <span className="text-[10px] text-[var(--muted)]">…</span>
                ) : (
                  <Play className="mt-0.5 h-3 w-3 shrink-0 text-[var(--muted)]" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="space-y-2 border-t border-[var(--line)] px-3 py-3">
        <button
          type="button"
          disabled={busy}
          className="flex w-full items-center justify-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 py-2 text-[11px] font-medium text-emerald-900 disabled:opacity-50"
          onClick={() => void runPreflight()}
        >
          {runningPreflight
            ? "Preflight steps 1–2…"
            : demo.dryRun
              ? "Preflight (dry, steps 1–2)"
              : "Preflight live (steps 1–2)"}
        </button>
        <button
          type="button"
          disabled={busy}
          className="flex w-full items-center justify-center gap-1 rounded-full border border-[var(--line)] bg-white py-2 text-[11px] font-medium text-[var(--ink)] disabled:opacity-50"
          onClick={() => {
            const next = demo.nextStep();
            if (next) void runStep(next);
          }}
        >
          Run next step
          <ChevronRight className="h-3 w-3" />
        </button>
        <button
          type="button"
          disabled={busy}
          className="flex w-full items-center justify-center gap-1 rounded-full bg-[var(--ink)] py-2 text-[11px] font-medium text-white disabled:opacity-50"
          onClick={() => void runAll()}
        >
          {runningAll ? "Running full demo…" : "Run full demo (~12 steps)"}
        </button>
      </div>
    </div>
  );
}
