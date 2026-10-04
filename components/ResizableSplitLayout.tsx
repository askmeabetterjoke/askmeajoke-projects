"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "agui-studio-split-ratio-h";
const DEFAULT_RATIO = 0.28;
const MIN_CHAT = 300;
const MIN_MAIN = 380;

type ResizableSplitLayoutProps = {
  chat: ReactNode;
  main: ReactNode;
  /** Extra nodes rendered before chat (e.g. hidden tool registrars) */
  beforeChat?: ReactNode;
  /** Chat panel on the left, main content on the right (always). */
  chatSide?: "left";
};

/**
 * Desktop-style split: chat | drag handle | main.
 * Does not switch to a top/bottom stack — resize is always horizontal.
 */
export function ResizableSplitLayout({
  chat,
  main,
  beforeChat,
}: ResizableSplitLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(DEFAULT_RATIO);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const n = Number.parseFloat(raw);
        if (Number.isFinite(n) && n > 0.18 && n < 0.62) setRatio(n);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = Math.min(
        0.58,
        Math.max(0.22, (e.clientX - rect.left) / rect.width),
      );
      setRatio(next);
    };

    const onUp = () => {
      setDragging(false);
      setRatio((r) => {
        try {
          localStorage.setItem(STORAGE_KEY, String(r));
        } catch {
          /* ignore */
        }
        return r;
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  const chatWidth = `${ratio * 100}%`;

  return (
    <div
      ref={containerRef}
      className={`flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden ${
        dragging ? "select-none" : ""
      }`}
    >
      {beforeChat}
      <aside
        style={{
          width: chatWidth,
          minWidth: MIN_CHAT,
          maxWidth: "58%",
        }}
        className="flex min-h-0 shrink-0 flex-col overflow-hidden rounded-[28px] border border-[var(--line)] bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]"
      >
        {chat}
      </aside>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize chat and content panels"
        aria-valuenow={Math.round(ratio * 100)}
        onPointerDown={onPointerDown}
        title="Drag left or right to resize"
        className={`relative z-10 flex w-3 shrink-0 cursor-col-resize flex-col items-center justify-center self-stretch bg-transparent transition-colors ${
          dragging ? "bg-[var(--chip)]" : ""
        }`}
      >
        <span className="pointer-events-none flex flex-col gap-1 opacity-50">
          <span className="h-1 w-1 rounded-full bg-[var(--muted-foreground)]" />
          <span className="h-1 w-1 rounded-full bg-[var(--muted-foreground)]" />
          <span className="h-1 w-1 rounded-full bg-[var(--muted-foreground)]" />
        </span>
      </div>
      <div
        style={{ minWidth: MIN_MAIN }}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-[var(--line)] bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]"
      >
        {main}
      </div>
    </div>
  );
}
