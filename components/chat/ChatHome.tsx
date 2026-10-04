"use client";

import { Suspense } from "react";
import { ChatDemoOverlay } from "./ChatDemoOverlay";
import { ChatDemoQuerySync } from "./ChatDemoQuerySync";
import { ChatDemoProvider } from "./ChatDemoProvider";
import { ChatDemoToggle } from "./ChatDemoToggle";
import { ChatDemoTools } from "./ChatDemoTools";
import { ChatPanel } from "./ChatPanel";
import { DocumentsProvider } from "../documents/DocumentsProvider";
import { DocumentsTools } from "../documents/DocumentsTools";
import { AnalyticsCanvas } from "../finance/AnalyticsCanvas";
import { AnalyticsTools } from "../finance/AnalyticsTools";
import { FinanceProvider, useFinance } from "../finance/FinanceProvider";
import { AppShell } from "../shell/AppShell";

function ChatShell() {
  const finance = useFinance();

  return (
    <AppShell
      crumb="Northwind"
      actionLabel={finance.tab === "documents" ? "Upload" : "New"}
      headerExtra={<ChatDemoToggle />}
      beforeChat={
        <>
          <ChatDemoTools />
          <AnalyticsTools />
          <DocumentsTools />
        </>
      }
      chat={<ChatPanel />}
      main={<AnalyticsCanvas />}
    />
  );
}

export function ChatHome() {
  return (
    <FinanceProvider>
      <DocumentsProvider>
        <ChatDemoProvider>
          <Suspense fallback={null}>
            <ChatDemoQuerySync />
          </Suspense>
          <ChatShell />
          <ChatDemoOverlay />
        </ChatDemoProvider>
      </DocumentsProvider>
    </FinanceProvider>
  );
}
