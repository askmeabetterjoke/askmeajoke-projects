"use client";

import { useAgentContext, useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { catalogSummary } from "../../lib/ui-catalog-store";
import { ReplaySandboxCard } from "./ReplaySandboxCard";
import { useUiCatalog } from "./UiCatalogProvider";

export function UiCatalogTools() {
  const catalog = useUiCatalog();

  useAgentContext({
    description:
      "Reusable generative UI catalog. Prefer replayCatalogUi (sandbox) or generate_a2ui with listed components instead of generateSandboxedUi when an entry matches the user intent.",
    value: {
      savedSurfaces: catalogSummary(catalog.entries),
      rule: "If savedSurfaces has a matching intent, reuse it. Do not regenerate HTML for a chart type already saved.",
    },
  });

  useFrontendTool({
    name: "saveUiToCatalog",
    description:
      "After generating UI, persist the mechanism so later turns can reuse it. For A2UI pass kind=a2ui and component names. For sandbox HTML pass kind=sandbox with css+html.",
    parameters: z.object({
      title: z.string(),
      intent: z.string().describe("What the user asked for, e.g. may spend pie"),
      description: z.string().optional(),
      kind: z.enum(["a2ui", "sandbox"]),
      components: z
        .array(z.string())
        .optional()
        .describe("A2UI catalog component names"),
      samplePrompt: z.string().optional(),
      css: z.string().optional(),
      html: z.string().optional(),
      jsFunctions: z.string().optional(),
      jsExpressions: z.array(z.string()).optional(),
    }),
    handler: async (args) => {
      if (args.kind === "sandbox") {
        const entry = catalog.saveSandbox({
          title: args.title,
          intent: args.intent,
          description: args.description,
          css: args.css ?? "",
          html: args.html ?? "",
          jsFunctions: args.jsFunctions,
          jsExpressions: args.jsExpressions,
        });
        return `Saved sandbox catalog entry ${entry.id} (${entry.title}). Reuse with replayCatalogUi.`;
      }
      const entry = catalog.saveA2ui({
        title: args.title,
        intent: args.intent,
        description: args.description,
        components: args.components ?? [],
        samplePrompt: args.samplePrompt ?? args.intent,
      });
      return `Saved A2UI recipe ${entry.id}. Next time call generate_a2ui with ${entry.a2ui?.components.join(", ")}.`;
    },
  });

  useFrontendTool({
    name: "replayCatalogUi",
    description:
      "Replay a previously saved generative UI from the catalog instead of calling generateSandboxedUi. Pass the catalog entry id from agent context savedSurfaces.",
    parameters: z.object({
      id: z.string(),
    }),
    handler: async ({ id }) => {
      const entry = catalog.get(id);
      if (!entry) return `No catalog entry ${id}`;
      catalog.bumpReuse(id);
      if (entry.kind === "a2ui") {
        return `A2UI recipe ${entry.title}: call generate_a2ui using ${entry.a2ui?.components.join(", ")}. Prompt: ${entry.a2ui?.samplePrompt}`;
      }
      return `Replaying sandbox ${entry.title} (${entry.id}).`;
    },
    render: ({ args }) => <ReplaySandboxCard id={args.id} />,
  });

  return null;
}
