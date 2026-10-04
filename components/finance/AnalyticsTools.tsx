"use client";

import {
  useAgentContext,
  useFrontendTool,
  useHumanInTheLoop,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { totals } from "../../lib/finance-data";
import { formatEmailPlaintext } from "../../lib/email-format";
import { useFinance } from "./FinanceProvider";
import { ControlledMetricCard } from "../playground/ControlledMetricCard";
import { ApproveChargeHitl } from "./ApproveChargeHitl";
import { DraftEmailTool } from "./DraftEmailTool";

export function AnalyticsTools() {
  const finance = useFinance();
  const metrics = totals(finance.charges);

  const chargeRollup = finance.charges.reduce(
    (acc, c) => {
      acc.totalSpend += c.amount;
      acc.byStatus[c.status] = (acc.byStatus[c.status] ?? 0) + 1;
      return acc;
    },
    {
      totalSpend: 0,
      byStatus: {} as Record<string, number>,
    },
  );

  useAgentContext({
    description: "What is on Alex's Northwind Finance screen right now",
    value: {
      user: "Alex Morgan",
      tab: finance.tab,
      metrics,
      cards: finance.cards.map((c) => ({
        last4: c.last4,
        brand: c.brand,
        available: c.available,
        limit: c.creditLimit,
      })),
      chargeRollup: {
        count: finance.charges.length,
        totalSpend: chargeRollup.totalSpend,
        byStatus: chargeRollup.byStatus,
      },
      visibleCharges: finance.visibleCharges.slice(0, 18).map((c) => ({
        id: c.id,
        merchant: c.merchant,
        amount: c.amount,
        status: c.status,
        team: c.team,
        date: c.date,
        note: c.note,
      })),
      ledger: finance.ledger.slice(0, 12),
      filter: finance.filter,
      lastPayment: "Google Ads -$5,000 on 2026-05-28",
    },
  });

  useFrontendTool({
    name: "demoControlledMetric",
    agentId: "analytics",
    description:
      "Controlled generative UI: render a KPI card in chat (components-as-tools). Use for demo step 3.",
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

  useFrontendTool({
    name: "openDashboard",
    agentId: "analytics",
    description:
      "Switch the visible Northwind dashboard tab on the right. Call this before approveCharge or filterCharges when driving the UI.",
    parameters: z.object({
      tab: z.enum([
        "overview",
        "cards",
        "charges",
        "transactions",
        "reports",
        "documents",
      ]),
    }),
    handler: async ({ tab }) => {
      finance.setTab(tab);
      return `Opened the ${tab} dashboard.`;
    },
  });

  useFrontendTool({
    name: "filterCharges",
    agentId: "analytics",
    description:
      "Filter or sort the charges table on the right. Use search for merchant name or charge id (e.g. c1, AWS, Amazon Web Services).",
    parameters: z.object({
      sort: z.enum(["most-expensive", "newest"]).optional(),
      show: z.enum(["all", "top10"]).optional(),
      status: z
        .enum(["all", "Approved", "Pending", "Flagged", "Over-Limit"])
        .optional(),
      search: z.string().optional(),
    }),
    handler: async (args) => {
      finance.setTab("charges");
      finance.setFilter(args);
      return `Applied charge filters: ${JSON.stringify(args)}`;
    },
  });

  useFrontendTool({
    name: "flagTransaction",
    agentId: "analytics",
    description: "Flag a charge or ledger row for review and attach a note.",
    parameters: z.object({
      merchantOrId: z.string(),
      note: z.string(),
    }),
    handler: async ({ merchantOrId, note }) => {
      finance.setTab("transactions");
      finance.flagTransaction(merchantOrId, note);
      return `Flagged ${merchantOrId} for review.`;
    },
  });

  useFrontendTool({
    name: "addNoteToTransaction",
    agentId: "analytics",
    description: "Add an operations note to a transaction.",
    parameters: z.object({
      merchantOrId: z.string(),
      note: z.string(),
    }),
    handler: async ({ merchantOrId, note }) => {
      finance.addNote(merchantOrId, note);
      return `Noted on ${merchantOrId}.`;
    },
  });

  useFrontendTool({
    name: "draftEmail",
    agentId: "analytics",
    description:
      "Required whenever the user asks to write, draft, or compose an email. Shows a To / Subject / Body card in chat with a Copy button. Base the email on live agent context (charges, teams, policy). Never paste the full email as plain chat text instead of this tool.",
    parameters: z.object({
      to: z
        .string()
        .describe("Recipient, e.g. finance@northwind.example"),
      cc: z.string().optional().describe("Optional Cc recipients"),
      subject: z.string(),
      body: z
        .string()
        .describe("Plain-text email body. Use facts from current finance context."),
    }),
    handler: async (args) =>
      `Drafted email for ${args.to}. User can copy it from the card.\n\n${formatEmailPlaintext(args)}`,
    render: ({ args, status }) => (
      <DraftEmailTool args={args} status={status} />
    ),
  });

  useHumanInTheLoop({
    name: "approveCharge",
    agentId: "analytics",
    description:
      "Required for any charge approval. Opens the Charges dashboard and shows an Approve/Deny card in chat. Pass charge id (e.g. c1), amount, and policy reason. Never approve in plain text instead of calling this tool.",
    parameters: z.object({
      merchantOrId: z
        .string()
        .describe("Charge id (c1) or merchant name / alias (AWS)"),
      amount: z.number(),
      reason: z.string(),
    }),
    render: ({ args, respond, status }) => (
      <ApproveChargeHitl args={args} status={status} respond={respond} />
    ),
  });

  return null;
}
