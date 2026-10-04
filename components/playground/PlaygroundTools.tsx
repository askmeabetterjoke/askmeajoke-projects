"use client";

import {
  useAgentContext,
  useConfigureSuggestions,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { useState } from "react";
import { z } from "zod";
import {
  CHARGE_STATUS_BREAKDOWN,
  MAY_2026_BY_VENDOR,
  MONTHLY_SPEND_2026,
  TEAM_SPEND_BY_MONTH,
} from "../../lib/chart-demo-data";
import {
  GEN_UI_MODULES,
  moduleById,
  type GenUiModule,
} from "../../lib/gen-ui-modules";
import { ControlledMetricCard } from "./ControlledMetricCard";

export function PlaygroundTools({
  selectedModuleId,
  onSelectModule,
}: {
  selectedModuleId?: string | null;
  onSelectModule?: (mod: GenUiModule) => void;
}) {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const activeModuleId = focusedId ?? selectedModuleId ?? null;

  useAgentContext({
    description: "Generative UI playground modules and sample chart data",
    value: {
      focusedModuleId: activeModuleId,
      modules: GEN_UI_MODULES.map((m) => ({
        id: m.id,
        title: m.title,
        tool: m.tool,
        components: m.catalogComponents,
        demoPrompt: m.demoPrompt,
      })),
      sampleData: {
        may2026ByVendor: MAY_2026_BY_VENDOR.map((d) => ({
          label: d.label,
          value: d.value,
        })),
        monthlySpend2026: MONTHLY_SPEND_2026.map((d) => ({
          label: d.label,
          value: d.value,
        })),
        teamSpendByMonth: {
          series: TEAM_SPEND_BY_MONTH.series.map((s) => ({
            key: s.key,
            label: s.label,
          })),
          rows: TEAM_SPEND_BY_MONTH.rows.map((r) => ({
            label: r.label,
            segments: { ...r.segments },
          })),
        },
        chargeStatusPercent: CHARGE_STATUS_BREAKDOWN.map((d) => ({
          label: d.label,
          value: d.value,
        })),
      },
    },
  });

  useConfigureSuggestions({
    available: "always",
    suggestions: GEN_UI_MODULES.slice(0, 6).map((m) => ({
      title: m.title,
      message: m.demoPrompt,
    })),
  });

  useFrontendTool({
    name: "focusPlaygroundModule",
    agentId: "playground",
    description:
      "Highlight a playground module on the capability chart by id.",
    parameters: z.object({
      id: z.enum([
        "controlled-metric",
        "a2ui-bar",
        "a2ui-pie",
        "a2ui-line",
        "a2ui-stacked",
        "a2ui-dashboard",
        "a2ui-pipeline",
        "open-donut",
        "open-gauge",
      ]),
    }),
    handler: async ({ id }) => {
      setFocusedId(id);
      const mod = moduleById(id);
      if (mod) onSelectModule?.(mod);
      return mod ? `Focused module ${mod.title}` : `Unknown module ${id}`;
    },
  });

  useFrontendTool({
    name: "demoControlledMetric",
    agentId: "playground",
    description:
      "Controlled Generative UI: render a KPI card in chat (components-as-tools).",
    parameters: z.object({
      label: z.string(),
      value: z.string(),
      note: z.string().optional(),
    }),
    render: ({ args, status }) => (
      <ControlledMetricCard
        label={args.label ?? "Metric"}
        value={args.value ?? "—"}
        note={
          args.note ||
          (status === "inProgress" ? "Loading controlled component…" : undefined)
        }
      />
    ),
    handler: async ({ label, value }) =>
      `Rendered controlled metric ${label}: ${value}`,
  });

  return null;
}
