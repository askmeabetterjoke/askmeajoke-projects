"use client";

import { useChatDemo } from "./ChatDemoProvider";
import { ChatDemoPanel } from "./ChatDemoPanel";

/** Slide-over presenter panel; does not occupy the chat column. */
export function ChatDemoOverlay() {
  const demo = useChatDemo();
  if (!demo.demoOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex justify-end p-3 pt-[4.25rem]">
      <div className="pointer-events-auto flex h-full w-[min(400px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
        <ChatDemoPanel />
      </div>
    </div>
  );
}
