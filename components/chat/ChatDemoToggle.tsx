"use client";

import { Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";
import { useChatDemo } from "./ChatDemoProvider";

export function ChatDemoToggle({ className }: { className?: string }) {
  const demo = useChatDemo();

  return (
    <button
      type="button"
      aria-pressed={demo.demoOpen}
      title="Open presenter demo (chat history is kept for this browser session)"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium transition",
        demo.demoOpen
          ? "border-[var(--ink)] bg-[var(--chip)] text-[var(--ink)]"
          : "border-[var(--line-strong)] bg-white text-[var(--ink)] hover:bg-[var(--chip)]",
        className,
      )}
      onClick={() => demo.setDemoOpen(!demo.demoOpen)}
    >
      <Sparkles className="h-3.5 w-3.5" />
      Demo
    </button>
  );
}
