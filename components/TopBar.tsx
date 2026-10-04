"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

export function TopBar() {
  const path = usePathname();
  const analytics = path.startsWith("/analytics");
  const playground = path.startsWith("/playground");
  const blog = !analytics && !playground;

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--line)] bg-[var(--card)]/95 px-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent)] text-xs font-bold text-white">
          {analytics ? "NF" : playground ? "UI" : "AG"}
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {analytics
              ? "Northwind Finance"
              : playground
                ? "Gen UI Playground"
                : "AG-UI Studio"}
          </p>
          <p className="text-sm font-semibold leading-none">
            {analytics
              ? "Hello, Alex"
              : playground
                ? "Capability chart & chart modules"
                : "AG-UI, CopilotKit — a note for PMs"}
          </p>
        </div>
      </div>
      <nav className="flex items-center gap-1 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] p-1 text-sm shadow-sm">
        <Link
          href="/"
          className={cn(
            "rounded-full px-3 py-1 font-medium transition-colors",
            blog
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--text-ink)] hover:bg-[var(--bg)]",
          )}
        >
          Blog
        </Link>
        <Link
          href="/playground"
          className={cn(
            "rounded-full px-3 py-1 font-medium transition-colors",
            playground
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--text-ink)] hover:bg-[var(--bg)]",
          )}
        >
          Playground
        </Link>
        <Link
          href="/analytics"
          className={cn(
            "rounded-full px-3 py-1 font-medium transition-colors",
            analytics
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--text-ink)] hover:bg-[var(--bg)]",
          )}
        >
          Analytics
        </Link>
      </nav>
    </header>
  );
}
