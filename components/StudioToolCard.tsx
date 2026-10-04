"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * Standard in-chat tool / HITL card shell. Use with studio-card-kicker,
 * studio-card-label, studio-card-value, studio-card-note for readable contrast
 * inside CopilotKit (where --muted is a background token, not text color).
 */
export function StudioToolCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("studio-tool-card rounded-2xl p-4", className)}>
      {children}
    </div>
  );
}
