"use client";

import Link from "next/link";
import { useUiCatalog } from "./UiCatalogProvider";

export function UiCatalogCanvas() {
  const catalog = useUiCatalog();

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-7 py-6">
      <header className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          UI catalog memory
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Reuse generated UI instead of regenerating it
        </h1>
        <p className="text-[15px] leading-7 text-[var(--muted)]">
          When Open Generative UI finishes, this studio stores the HTML/CSS/JS
          (and A2UI recipes) in a local catalog. Next time the copilot sees a
          matching intent, it should call{" "}
          <code className="rounded bg-[var(--chip)] px-1.5">replayCatalogUi</code>{" "}
          or <code className="rounded bg-[var(--chip)] px-1.5">generate_a2ui</code>{" "}
          — not invent a new pie chart from scratch.
        </p>
      </header>

      {catalog.entries.length === 0 ? (
        <p className="rounded-[24px] border border-dashed border-[var(--line-strong)] bg-[var(--chip)] p-6 text-sm text-[var(--muted)]">
          Nothing saved yet. Ask for a sandbox chart in{" "}
          <Link href="/chat" className="font-medium text-[var(--ink)] underline">
            Chat
          </Link>{" "}
          (Finance ops) — completed Open Gen UI auto-saves here.
        </p>
      ) : (
        <ul className="space-y-3">
          {catalog.entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-[24px] border border-[var(--line)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {entry.kind}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">{entry.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Intent: {entry.intent}
                  </p>
                  {entry.a2ui ? (
                    <p className="mt-1 font-mono text-[11px]">
                      {entry.a2ui.components.join(" · ")}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-[11px] text-[var(--muted)]">
                    {entry.reuseCount} reuse{entry.reuseCount === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    className="text-[11px] text-rose-600"
                    onClick={() => catalog.remove(entry.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="mt-2 rounded-xl bg-[var(--chip)] px-3 py-2 font-mono text-[11px] text-[var(--ink)]">
                replayCatalogUi id={entry.id}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
