"use client";

import type { ReactNode } from "react";
import { ResizableSplitLayout } from "../ResizableSplitLayout";
import { AppSidebar } from "./AppSidebar";
import { CanvasHeader } from "./CanvasHeader";
import { useShellLayout } from "./ShellLayout";

export function AppShell({
  crumb,
  actionLabel,
  headerExtra,
  chat,
  main,
  beforeChat,
}: {
  crumb: string;
  actionLabel?: string;
  headerExtra?: ReactNode;
  chat: ReactNode;
  main: ReactNode;
  beforeChat?: ReactNode;
}) {
  const { sidebarOpen } = useShellLayout();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      {sidebarOpen ? (
        <div className="h-full w-[232px] shrink-0">
          <AppSidebar className="w-[232px]" />
        </div>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <CanvasHeader
          crumb={crumb}
          actionLabel={actionLabel}
          headerExtra={headerExtra}
        />
        <div className="flex min-h-0 min-w-0 flex-1 px-3 pb-3">
          <ResizableSplitLayout
            beforeChat={beforeChat}
            chat={chat}
            main={main}
          />
        </div>
      </div>
    </div>
  );
}
