import { z } from "zod";
import type { CatalogDefinitions } from "@copilotkit/a2ui-renderer";

export const studioDefinitions = {
  Row: {
    description:
      "Horizontal layout. Children share width. Use gap in pixels.",
    props: z.object({
      gap: z.number().optional(),
      children: z.array(z.string()),
    }),
  },
  Column: {
    description: "Vertical layout. Use gap in pixels.",
    props: z.object({
      gap: z.number().optional(),
      children: z.array(z.string()),
    }),
  },
  Text: {
    description: "A short explanation line.",
    props: z.object({ text: z.string() }),
  },
  Card: {
    description: "Titled card grouping related content.",
    props: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      child: z.string().optional(),
    }),
  },
  Metric: {
    description: "KPI tile with optional trend.",
    props: z.object({
      label: z.string(),
      value: z.string(),
      trend: z.enum(["up", "down", "neutral"]).optional(),
      trendValue: z.string().optional(),
    }),
  },
  StatusBadge: {
    description: "Small status pill.",
    props: z.object({
      text: z.string(),
      variant: z.enum(["success", "warning", "error", "info"]).optional(),
    }),
  },
  DataTable: {
    description: "Table of rows. Each row key must appear in columns[].key.",
    props: z.object({
      columns: z.array(z.object({ key: z.string(), label: z.string() })),
      rows: z.array(z.record(z.union([z.string(), z.number()]))),
    }),
  },
  PipelineStep: {
    description:
      "One stage in the AG-UI middleware pipeline (input, middleware, agent, or UI).",
    props: z.object({
      title: z.string(),
      hint: z.string(),
      kind: z.enum(["input", "middleware", "agent", "ui"]),
    }),
  },
  CapabilityCard: {
    description: "Explain one middleware capability.",
    props: z.object({
      title: z.string(),
      detail: z.string(),
    }),
  },
  BarChart: {
    description: "Vertical bars. data is { label, value }[].",
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      data: z.array(z.object({ label: z.string(), value: z.number() })),
    }),
  },
  PieChart: {
    description:
      "Pie or share breakdown. data is { label, value }[] (values are amounts or counts).",
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      data: z.array(z.object({ label: z.string(), value: z.number() })),
    }),
  },
  LineChart: {
    description:
      "Line trend over time. data is { label, value }[] (label = period, value = metric).",
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      data: z.array(z.object({ label: z.string(), value: z.number() })),
    }),
  },
  StackedBarChart: {
    description:
      "Stacked vertical bars by segment. series defines stack keys; rows have label + segments map.",
    props: z.object({
      title: z.string(),
      description: z.string().optional(),
      series: z.array(z.object({ key: z.string(), label: z.string() })),
      rows: z.array(
        z.object({
          label: z.string(),
          segments: z.record(z.number()),
        }),
      ),
    }),
  },
  EmailDraft: {
    description:
      "Ready-to-send email card with To, optional Cc, subject, body, and a Copy button.",
    props: z.object({
      to: z.string(),
      cc: z.string().optional(),
      subject: z.string(),
      body: z.string(),
    }),
  },
} satisfies CatalogDefinitions;

export type StudioDefinitions = typeof studioDefinitions;
