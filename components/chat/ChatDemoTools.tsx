"use client";

import { useConfigureSuggestions } from "@copilotkit/react-core/v2";
import { useMemo } from "react";
import { demoStepsForAgent } from "../../lib/chat-demo-flow";
import { useFinance } from "../finance/FinanceProvider";
import { useChatDemo } from "./ChatDemoProvider";

/** Suggestion chips aligned with the guided demo while presenter mode is open. */
export function ChatDemoTools() {
  const finance = useFinance();
  const demo = useChatDemo();
  const agent = finance.tab === "documents" ? "documents" : "analytics";

  const suggestions = useMemo(
    () =>
      demo.demoOpen
        ? demoStepsForAgent(agent).map((s) => ({
            title: `${s.step}. ${s.title}`,
            message: s.prompt,
          }))
        : [],
    [agent, demo.demoOpen],
  );

  useConfigureSuggestions({
    available: demo.demoOpen ? "always" : "disabled",
    suggestions,
  });

  return null;
}
