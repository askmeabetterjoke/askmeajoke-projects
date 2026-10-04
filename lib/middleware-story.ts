export const BLOG_SECTIONS = [
  {
    id: "current-state",
    title: "Where copilots are today",
    kicker: "01",
    summary:
      "Most product copilots are a chat box next to the app: they explain, they don’t operate, and they don’t share a contract with the UI.",
  },
  {
    id: "stall",
    title: "Why that model stalls",
    kicker: "02",
    summary:
      "Text-only agents can’t drive dashboards, can’t enforce policy, and lock you to one model vendor’s UI tricks.",
  },
  {
    id: "ag-ui",
    title: "AG-UI is the product contract",
    kicker: "03",
    summary:
      "AG-UI is the Agent–User Interaction protocol: a typed event stream so any agent can talk to any frontend.",
  },
  {
    id: "copilotkit",
    title: "What CopilotKit is building",
    kicker: "04",
    summary:
      "CopilotKit is the product layer on AG-UI: runtime, middleware, chat, tools, HITL, and generative UI.",
  },
  {
    id: "spectrum",
    title: "The generative UI spectrum",
    kicker: "05",
    summary:
      "Controlled components, declarative A2UI catalogs, and open sandboxed HTML — pick per feature, not per product.",
  },
  {
    id: "studio",
    title: "What this studio implements",
    kicker: "06",
    summary:
      "Three surfaces: this essay, unified Chat (finance + documents), and the UI catalog for reusing generative UI.",
  },
  {
    id: "live",
    title: "Watch it happen",
    kicker: "07",
    summary:
      "AuditMiddleware records every AG-UI event. Ask the copilot, then watch the stream.",
  },
] as const;

export type CapabilityId =
  | "transform"
  | "filter"
  | "policy"
  | "auth"
  | "observe"
  | "recover"
  | "a2ui"
  | "openGenUi"
  | "bridge";

export const CAPABILITIES: {
  id: CapabilityId;
  title: string;
  detail: string;
}[] = [
  {
    id: "transform",
    title: "Transform events",
    detail:
      "Rewrite TEXT_MESSAGE_* and TOOL_CALL_* as they stream. Prefix, redact, timestamp, or compact noisy chunks.",
  },
  {
    id: "filter",
    title: "Filter tool calls",
    detail:
      "Allow-list or deny-list tools on the way out. FilterToolCallsMiddleware is built in; you can also write your own.",
  },
  {
    id: "policy",
    title: "Inject policy & context",
    detail:
      "Mutate RunAgentInput before the model runs: spend limits, user role, current dashboard tab, forwarded headers.",
  },
  {
    id: "auth",
    title: "Attach credentials",
    detail:
      "Because this runs server-side, middleware can stamp Bearer tokens onto forwardedProps that the browser never sees.",
  },
  {
    id: "observe",
    title: "Observe the run",
    detail:
      "Count events, time the run, emit metrics. This studio’s AuditMiddleware writes a ring buffer you can inspect live.",
  },
  {
    id: "recover",
    title: "Recover from errors",
    detail:
      "catchError on the RxJS stream, emit RUN_ERROR, retry, or swap in a fallback agent without changing the UI.",
  },
  {
    id: "a2ui",
    title: "Declarative UI (A2UI)",
    detail:
      "A2UIMiddleware turns generate_a2ui tool results into cards, metrics, tables, and charts from a catalog you own.",
  },
  {
    id: "openGenUi",
    title: "Open Generative UI",
    detail:
      "OpenGenerativeUIMiddleware turns generateSandboxedUi into activity events rendered in a sandboxed iframe — Chart.js, custom HTML, CDN libraries.",
  },
  {
    id: "bridge",
    title: "Bridge other protocols",
    detail:
      "A middleware agent can wrap OpenAI, LangGraph, ADK, or any REST/WebSocket API and emit standard AG-UI events.",
  },
];

export const PIPELINE = [
  { id: "input", label: "RunAgentInput", hint: "messages, tools, state, context" },
  { id: "policy", label: "PolicyMiddleware", hint: "inject spend policy + role" },
  { id: "audit", label: "AuditMiddleware", hint: "log every event, time the run" },
  { id: "a2ui-mw", label: "A2UIMiddleware", hint: "catalog surfaces (generate_a2ui)" },
  {
    id: "ogui-mw",
    label: "OpenGenerativeUIMiddleware",
    hint: "sandboxed HTML (generateSandboxedUi)",
  },
  { id: "agent", label: "BuiltInAgent", hint: "model + tools" },
  {
    id: "ui",
    label: "CopilotChat",
    hint: "A2UI catalog + open-gen iframe",
  },
] as const;

export const STUDIO_SURFACES = [
  {
    href: "/",
    title: "This blog",
    role: "Explain",
    body: "The copilot scrolls sections, highlights capabilities, and can draw the pipeline as A2UI — the essay is a live product, not a PDF.",
  },
  {
    href: "/chat",
    title: "Chat",
    role: "Operate the product",
    body: "One workspace: LangGraph finance ops (dashboards, HITL charges, A2UI charts) and Agno document intake (extract, approve expenses) with a mode switch.",
  },
] as const;
