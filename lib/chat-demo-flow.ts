import type { DashboardTab } from "./finance-data";

export type DemoCapability =
  | "agent-context"
  | "frontend-tools"
  | "controlled-ui"
  | "a2ui"
  | "open-gen-ui"
  | "hitl"
  | "tool-render"
  | "multi-agent"
  | "ag-ui-stream";

export type DemoAgent = "analytics" | "documents";

export type ChatDemoStep = {
  id: string;
  step: number;
  title: string;
  capability: DemoCapability;
  capabilityLabel: string;
  tab: DashboardTab;
  agent: DemoAgent;
  prompt: string;
  presenterNote: string;
  /** When set, demo run attaches this PDF without leaving files in chat history. */
  pdfFileName?: string;
  /** Presenter must click Approve/Deny in chat before the run completes. */
  requiresHitl?: boolean;
};

/** LangGraph + Agno steps that block on human approval cards. */
export const DEMO_HITL_STEP_IDS = [
  "hitl-charge",
  "pdf-aws",
  "pdf-delta",
  "pdf-acme",
] as const;

export const PREFLIGHT_DEMO_STEP_IDS = ["context", "frontend-tools"] as const;

export const DEMO_CAPABILITY_STYLES: Record<
  DemoCapability,
  { bg: string; text: string }
> = {
  "agent-context": { bg: "bg-slate-100", text: "text-slate-800" },
  "frontend-tools": { bg: "bg-blue-100", text: "text-blue-900" },
  "controlled-ui": { bg: "bg-violet-100", text: "text-violet-900" },
  a2ui: { bg: "bg-emerald-100", text: "text-emerald-900" },
  "open-gen-ui": { bg: "bg-amber-100", text: "text-amber-900" },
  hitl: { bg: "bg-rose-100", text: "text-rose-900" },
  "tool-render": { bg: "bg-cyan-100", text: "text-cyan-900" },
  "multi-agent": { bg: "bg-indigo-100", text: "text-indigo-900" },
  "ag-ui-stream": { bg: "bg-neutral-200", text: "text-neutral-800" },
};

/** Presenter demo: charts on analytics, PDF intake + approvals on documents. */
export const CHAT_DEMO_STEPS: ChatDemoStep[] = [
  {
    id: "context",
    step: 1,
    title: "Agent context",
    capability: "agent-context",
    capabilityLabel: "Shared state → model",
    tab: "overview",
    agent: "analytics",
    prompt: "What's on my screen right now? Use the live dashboard context.",
    presenterNote:
      "The model reads tab, charges, and metrics from useAgentContext — not a stale prompt.",
  },
  {
    id: "frontend-tools",
    step: 2,
    title: "Frontend tools",
    capability: "frontend-tools",
    capabilityLabel: "Agent drives the app",
    tab: "charges",
    agent: "analytics",
    prompt:
      "Open the Charges tab and filter to the top 10 most expensive charges.",
    presenterNote:
      "openDashboard + filterCharges mutate the canvas; AG-UI forwards tool calls from LangGraph.",
  },
  {
    id: "controlled-metric",
    step: 3,
    title: "Controlled generative UI",
    capability: "controlled-ui",
    capabilityLabel: "Components as tools",
    tab: "overview",
    agent: "analytics",
    prompt:
      'Call demoControlledMetric with label "May spend", value "$54,800", and a short note that this is a React card rendered by a frontend tool.',
    presenterNote:
      "You own the component; the agent only supplies props — safest gen-UI tier.",
  },
  {
    id: "a2ui-pie",
    step: 4,
    title: "A2UI vendor pie",
    capability: "a2ui",
    capabilityLabel: "Declarative PieChart",
    tab: "reports",
    agent: "analytics",
    prompt:
      "Use generate_a2ui with PieChart and a DataTable for May 2026 spend by vendor (Cvent, AWS, Microsoft 365, Google Ads). Do not use a sandbox chart.",
    presenterNote:
      "Runtime injects generate_a2ui; branded catalog components render on Reports.",
  },
  {
    id: "a2ui-bar",
    step: 5,
    title: "A2UI category bar",
    capability: "a2ui",
    capabilityLabel: "Declarative BarChart",
    tab: "reports",
    agent: "analytics",
    prompt:
      "Use generate_a2ui with BarChart showing May spend by category (Travel, Cloud, Software, Events). Add a short DataTable with the same numbers.",
    presenterNote:
      "Second analytics chart — still catalog A2UI, not sandbox HTML.",
  },
  {
    id: "open-donut",
    step: 6,
    title: "Open generative UI",
    capability: "open-gen-ui",
    capabilityLabel: "Sandboxed doughnut",
    tab: "reports",
    agent: "analytics",
    prompt:
      "Use generateSandboxedUi to show a Chart.js doughnut of charge status mix (Approved, Pending, Flagged, Over-Limit). Grayscale, finance aesthetic.",
    presenterNote:
      "Open Gen UI middleware runs HTML/JS in a sandbox when the catalog is not enough.",
  },
  {
    id: "hitl-charge",
    step: 7,
    title: "HITL charge approval",
    capability: "hitl",
    capabilityLabel: "useHumanInTheLoop",
    tab: "charges",
    agent: "analytics",
    prompt:
      "Approve the $91,800 Amazon Web Services charge (c1). Use the approval card in chat — open Charges first.",
    presenterNote:
      "LangGraph calls approveCharge; human must click Approve — policy is enforced in UI.",
    requiresHitl: true,
  },
  {
    id: "pdf-aws",
    step: 8,
    title: "PDF: AWS invoice",
    capability: "multi-agent",
    capabilityLabel: "Upload + extract",
    tab: "documents",
    agent: "documents",
    pdfFileName: "aws-consulting-may.pdf",
    prompt:
      "I attached our AWS invoice PDF. openDashboard tab documents. Call extract_invoice for INV-1042, applyInvoiceToCanvas, then approveExpense with a policy reason for amount over $500.",
    presenterNote:
      "LangGraph documents agent — extract + canvas; approve on the HITL card.",
    requiresHitl: true,
  },
  {
    id: "pdf-delta",
    step: 9,
    title: "PDF: travel receipt",
    capability: "multi-agent",
    capabilityLabel: "Upload + extract",
    tab: "documents",
    agent: "documents",
    pdfFileName: "delta-receipt-sfo.pdf",
    prompt:
      "Attached Delta receipt. extract_invoice INV-2091, applyInvoiceToCanvas, then approveExpense with reason \"Travel receipt within policy.\"",
    presenterNote:
      "Second PDF intake — typical receipt under policy.",
    requiresHitl: true,
  },
  {
    id: "pdf-acme",
    step: 10,
    title: "PDF: office supplies",
    capability: "hitl",
    capabilityLabel: "approveExpense HITL",
    tab: "documents",
    agent: "documents",
    pdfFileName: "acme-q2-supplies.pdf",
    prompt:
      "Attached Acme invoice PDF. extract_invoice INV-3300, applyInvoiceToCanvas, then approveExpense with reason \"Q2 office supplies pre-approved.\"",
    presenterNote:
      "Third PDF — approved rows merge into Finance charges (inv-* prefix).",
    requiresHitl: true,
  },
  {
    id: "close-loop",
    step: 11,
    title: "Ledger + chart",
    capability: "frontend-tools",
    capabilityLabel: "Multi-agent handoff",
    tab: "charges",
    agent: "analytics",
    prompt:
      "Open Charges and summarize document-approved rows (inv- prefix). Then use generate_a2ui BarChart of approved document spend by vendor.",
    presenterNote:
      "Documents in via LangGraph documents, analytics charts out — shared product state.",
  },
  {
    id: "ag-ui-stream",
    step: 12,
    title: "AG-UI event stream",
    capability: "ag-ui-stream",
    capabilityLabel: "AuditMiddleware",
    tab: "reports",
    agent: "analytics",
    prompt:
      "In one sentence, remind me to watch the live AG-UI event stream on Reports while I send another message.",
    presenterNote:
      "Reports tab shows streamed AG-UI events from the runtime audit path.",
  },
];

export function demoStepsForAgent(agent: DemoAgent) {
  return CHAT_DEMO_STEPS.filter((s) => s.agent === agent);
}
