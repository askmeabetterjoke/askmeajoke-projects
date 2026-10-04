"use client";

import {
  HelpCircle,
  PanelLeftClose,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useShellLayout } from "./ShellLayout";

const TODAY = [
  "Run demo step 1 — context",
  "Step 4 — A2UI pie chart",
  "Step 6 — HITL AWS approval",
  "Step 8 — Agno INV-2091",
];

export function AppSidebar({ className }: { className?: string }) {
  const { setSidebarOpen } = useShellLayout();

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-[var(--line)] bg-[var(--sidebar)] px-3 pb-14 pt-3",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--ink)] text-white">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight tracking-tight">
            AskMeAJoke Projects
          </p>
        </div>
        <button
          type="button"
          aria-label="Close sidebar"
          title="Close sidebar"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--chip)] hover:text-[var(--ink)]"
          onClick={() => setSidebarOpen(false)}
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <label className="mt-3 flex items-center gap-2 rounded-full bg-[var(--chip)] px-3 py-2 text-[13px] text-[var(--muted)]">
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span>Search …</span>
        <kbd className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)]">
          K
        </kbd>
      </label>

      <p className="mt-6 flex items-center justify-between px-2 text-[11px] font-medium text-[var(--muted)]">
        Today
      </p>
      <ul className="mt-1 space-y-0.5 px-1">
        {TODAY.map((item) => (
          <li
            key={item}
            className="truncate rounded-lg px-2 py-1.5 text-[12px] leading-4 text-[var(--muted)]"
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-1 px-1 pb-1">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-[13px] text-[var(--muted)]"
        >
          <Settings className="h-4 w-4" />
          Setting
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-[13px] text-[var(--muted)]"
        >
          <HelpCircle className="h-4 w-4" />
          Help Center
        </button>
        <div className="mt-2 flex items-center gap-2 rounded-2xl px-2 py-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--chip)] text-[11px] font-semibold">
            AM
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium leading-none">
              Alex Morgan
            </p>
            <p className="mt-0.5 truncate text-[11px] text-[var(--muted)]">
              Northwind Finance
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-0.5 rounded-full bg-[var(--chip)] p-0.5 text-[10px] leading-none">
          <span className="rounded-full bg-white px-1 py-1.5 text-center font-medium shadow-sm">
            Light
          </span>
          <span className="rounded-full px-1 py-1.5 text-center text-[var(--muted)]">
            Dark
          </span>
          <span className="rounded-full px-1 py-1.5 text-center text-[var(--muted)]">
            System
          </span>
        </div>
      </div>
    </aside>
  );
}
