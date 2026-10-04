"use client";

import type { ReactNode } from "react";
import { Bell, Menu, PanelLeftOpen, Plus } from "lucide-react";
import { useShellLayout } from "./ShellLayout";

export function CanvasHeader({
  crumb,
  actionLabel,
  headerExtra,
}: {
  crumb: string;
  actionLabel?: string;
  headerExtra?: ReactNode;
}) {
  const { sidebarOpen, toggleSidebar } = useShellLayout();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-5">
      <div className="flex items-center gap-2">
        {!sidebarOpen ? (
          <button
            type="button"
            aria-label="Open sidebar"
            title="Open sidebar"
            className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--chip)]"
            onClick={() => toggleSidebar()}
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        ) : null}
        <p className="text-[13px] text-[var(--muted)]">
          <span className="mr-1">‹</span>
          {crumb}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {headerExtra}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--chip)]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3.5 py-2 text-[13px] font-medium text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          {actionLabel ?? "New"}
        </button>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--chip)]"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          onClick={() => toggleSidebar()}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
