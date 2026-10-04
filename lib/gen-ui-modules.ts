export type GenUiSpectrum = "controlled" | "declarative" | "open";

export type GenUiModule = {
  id: string;
  title: string;
  description: string;
  spectrum: GenUiSpectrum;
  tool: "generate_a2ui" | "generateSandboxedUi" | "frontend-tool";
  catalogComponents: string[];
  demoPrompt: string;
};

export const GEN_UI_SPECTRUM: {
  id: GenUiSpectrum;
  label: string;
  tagline: string;
}[] = [
  {
    id: "controlled",
    label: "Controlled",
    tagline: "You built the component; the agent picks it and passes data.",
  },
  {
    id: "declarative",
    label: "Declarative (A2UI)",
    tagline: "Agent composes from your catalog — charts, metrics, tables.",
  },
  {
    id: "open",
    label: "Open Generative UI",
    tagline: "Sandboxed HTML/JS — CDN charts and custom visuals.",
  },
];

export const GEN_UI_MODULES: GenUiModule[] = [
  {
    id: "controlled-metric",
    title: "Components as tools",
    description:
      "Frontend tool with a custom render card — predictable KPI callouts.",
    spectrum: "controlled",
    tool: "frontend-tool",
    catalogComponents: [],
    demoPrompt:
      "Call demoControlledMetric with label \"May spend\" and value \"$54,800\" to show the controlled component card.",
  },
  {
    id: "a2ui-bar",
    title: "Bar chart",
    description: "Vertical bars for ranking vendors or categories.",
    spectrum: "declarative",
    tool: "generate_a2ui",
    catalogComponents: ["BarChart", "Card", "Column"],
    demoPrompt:
      "Use generate_a2ui with BarChart: title \"Top May vendors\", data Cvent 24800, AWS 15000, Microsoft 365 10000, Google Ads 5000.",
  },
  {
    id: "a2ui-pie",
    title: "Pie chart",
    description: "Share breakdown — same data as bars, different catalog type.",
    spectrum: "declarative",
    tool: "generate_a2ui",
    catalogComponents: ["PieChart", "DataTable"],
    demoPrompt:
      "Use generate_a2ui with PieChart for May 2026 spend by vendor (Cvent, AWS, Microsoft 365, Google Ads) plus a small DataTable of the rows.",
  },
  {
    id: "a2ui-line",
    title: "Line chart",
    description: "Trend over time — monthly spend trajectory.",
    spectrum: "declarative",
    tool: "generate_a2ui",
    catalogComponents: ["LineChart", "Metric"],
    demoPrompt:
      "Use generate_a2ui with LineChart titled \"2026 monthly spend\" and a Row of Metric tiles for peak month and latest month.",
  },
  {
    id: "a2ui-stacked",
    title: "Stacked bar",
    description: "Compare segments (teams) per period.",
    spectrum: "declarative",
    tool: "generate_a2ui",
    catalogComponents: ["StackedBarChart", "StatusBadge"],
    demoPrompt:
      "Use generate_a2ui with StackedBarChart for team spend Apr–Jul (Engineering, Marketing, People, Finance).",
  },
  {
    id: "a2ui-dashboard",
    title: "Dashboard compose",
    description: "Column of Metric, BarChart, and DataTable in one surface.",
    spectrum: "declarative",
    tool: "generate_a2ui",
    catalogComponents: ["Column", "Metric", "BarChart", "DataTable", "Card"],
    demoPrompt:
      "Use generate_a2ui to build a mini finance dashboard: 3 Metric KPIs, a BarChart of charge status counts, and a 4-row DataTable.",
  },
  {
    id: "a2ui-pipeline",
    title: "Middleware pipeline",
    description: "PipelineStep + CapabilityCard storytelling layout.",
    spectrum: "declarative",
    tool: "generate_a2ui",
    catalogComponents: ["PipelineStep", "CapabilityCard", "Column"],
    demoPrompt:
      "Use generate_a2ui to draw the AG-UI pipeline (Policy → Audit → A2UI → Open Gen UI → Agent → Chat) as PipelineStep cards.",
  },
  {
    id: "open-donut",
    title: "Sandbox donut",
    description: "Chart.js donut when you want CDN styling beyond the catalog.",
    spectrum: "open",
    tool: "generateSandboxedUi",
    catalogComponents: [],
    demoPrompt:
      "Use generateSandboxedUi to build a Chart.js doughnut of charge status mix (Approved 62%, Pending 14%, Flagged 8%, Over-Limit 16%).",
  },
  {
    id: "open-gauge",
    title: "Sandbox gauge",
    description: "Custom HTML/CSS gauge — not worth cataloging for one-off demos.",
    spectrum: "open",
    tool: "generateSandboxedUi",
    catalogComponents: [],
    demoPrompt:
      "Use generateSandboxedUi to show a spend-limit gauge at 72% with Northwind styling.",
  },
];

export function moduleById(id: string): GenUiModule | undefined {
  return GEN_UI_MODULES.find((m) => m.id === id);
}
