import type { DashboardTab } from "./finance-data";
import type { ChatDemoStep } from "./chat-demo-flow";
import { PREFLIGHT_DEMO_STEP_IDS } from "./chat-demo-flow";

export type DemoFinanceActions = {
  setTab: (tab: DashboardTab) => void;
  setFilter: (patch: {
    show?: "all" | "top10";
    sort?: "most-expensive" | "newest";
    status?: "all" | "Approved" | "Pending" | "Flagged" | "Over-Limit";
    search?: string;
  }) => void;
};

/** UI-only simulation for presenter walkthrough without OpenAI/LangGraph/Agno. */
export function applyDryRunStep(
  step: ChatDemoStep,
  finance: DemoFinanceActions,
): void {
  finance.setTab(step.tab);

  if (step.id === "frontend-tools") {
    finance.setFilter({
      show: "top10",
      sort: "most-expensive",
      status: "all",
    });
  }

  if (step.id === "hitl-charge") {
    finance.setTab("charges");
    finance.setFilter({ search: "c1", show: "all" });
  }
}

export function isPreflightStep(step: ChatDemoStep): boolean {
  return (PREFLIGHT_DEMO_STEP_IDS as readonly string[]).includes(step.id);
}

export function preflightSteps(steps: ChatDemoStep[]): ChatDemoStep[] {
  return steps.filter((s) => isPreflightStep(s));
}
