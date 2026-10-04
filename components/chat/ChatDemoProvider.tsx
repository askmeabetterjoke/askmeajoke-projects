"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  CHAT_DEMO_STEPS,
  type ChatDemoStep,
} from "../../lib/chat-demo-flow";

type ChatDemoState = {
  demoOpen: boolean;
  setDemoOpen: (open: boolean) => void;
  dryRun: boolean;
  setDryRun: (dry: boolean) => void;
  activeStepId: string | null;
  completedStepIds: string[];
  markCompleted: (id: string) => void;
  setActiveStepId: (id: string | null) => void;
  steps: ChatDemoStep[];
  nextStep: () => ChatDemoStep | null;
};

const ChatDemoContext = createContext<ChatDemoState | null>(null);

export function ChatDemoProvider({ children }: { children: React.ReactNode }) {
  const [demoOpen, setDemoOpenState] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

  const markCompleted = useCallback((id: string) => {
    setCompletedStepIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const nextStep = useCallback(() => {
    const idx = CHAT_DEMO_STEPS.findIndex((s) => s.id === activeStepId);
    const next =
      CHAT_DEMO_STEPS[idx + 1] ??
      CHAT_DEMO_STEPS.find((s) => !completedStepIds.includes(s.id)) ??
      CHAT_DEMO_STEPS[0];
    setActiveStepId(next?.id ?? null);
    return next ?? null;
  }, [activeStepId, completedStepIds]);

  const setDemoOpen = useCallback((open: boolean) => {
    if (!open) {
      setActiveStepId(null);
    }
    setDemoOpenState(open);
  }, []);

  const value = useMemo(
    () => ({
      demoOpen,
      setDemoOpen,
      dryRun,
      setDryRun,
      activeStepId,
      completedStepIds,
      markCompleted,
      setActiveStepId,
      steps: CHAT_DEMO_STEPS,
      nextStep,
    }),
    [
      activeStepId,
      completedStepIds,
      demoOpen,
      dryRun,
      markCompleted,
      nextStep,
      setDemoOpen,
    ],
  );

  return (
    <ChatDemoContext.Provider value={value}>{children}</ChatDemoContext.Provider>
  );
}

export function useChatDemo() {
  const ctx = useContext(ChatDemoContext);
  if (!ctx) {
    throw new Error("useChatDemo must be used inside ChatDemoProvider");
  }
  return ctx;
}
