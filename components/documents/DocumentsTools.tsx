"use client";

import {
  useAgentContext,
  useFrontendTool,
  useHumanInTheLoop,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { findDemoInvoice } from "../../lib/demo-invoices";
import { ledgerSummary } from "../../lib/invoice-ledger-store";
import type { InvoiceSource } from "../../lib/invoice-ledger-store";
import { useFinance } from "../finance/FinanceProvider";
import { ApproveExpenseHitl } from "./ApproveExpenseHitl";
import { useDocuments } from "./DocumentsProvider";

export function DocumentsTools() {
  const docs = useDocuments();
  const finance = useFinance();

  useAgentContext({
    description: "Northwind document inbox and current extraction",
    value: {
      user: "Alex Morgan",
      inbox: ledgerSummary(docs.inbox),
      selectedId: docs.selectedId,
      selected: docs.inbox.find((r) => r.id === docs.selectedId) ?? null,
      policy:
        "Receipts over $500 need a reason on approveExpense. Over $10,000 cite Northwind spend policy.",
      samples: ["INV-1042", "INV-2091", "INV-3300", "INV-5501"],
    },
  });

  useFrontendTool({
    name: "extract_invoice",
    agentId: "documents",
    description:
      "Return structured invoice fields for demo sample ids INV-1042, INV-2091, INV-3300, INV-5501. Call before applyInvoiceToCanvas.",
    parameters: z.object({
      sample_id: z
        .string()
        .describe("Invoice id such as INV-1042 from the user message or PDF name"),
      notes: z.string().optional(),
    }),
    handler: async ({ sample_id, notes }) => {
      const inv = findDemoInvoice(sample_id);
      if (inv) {
        return JSON.stringify({
          id: inv.id,
          vendor: inv.vendor,
          amount: inv.amount,
          date: inv.date,
          category: inv.category,
          source: inv.source,
          confidence: inv.confidence,
          fileName: inv.fileName,
          lineItems: inv.lineItems,
        });
      }
      if (notes?.trim()) {
        return JSON.stringify({ parsedFromAttachment: true, notes });
      }
      return JSON.stringify({
        error: "unknown_sample",
        hint: "Use INV-1042, INV-2091, INV-3300, INV-5501, or pass notes from attachment.",
      });
    },
  });

  useFrontendTool({
    name: "openDashboard",
    agentId: "documents",
    description:
      "Switch the Northwind dashboard tab on the right. Use tab documents when working with invoices.",
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
    name: "applyInvoiceToCanvas",
    agentId: "documents",
    description:
      "Required after extraction. Updates the Documents canvas with structured invoice fields.",
    parameters: z.object({
      id: z.string(),
      vendor: z.string(),
      amount: z.number(),
      date: z.string(),
      category: z.string(),
      source: z.enum(["invoice", "receipt"]),
      confidence: z.number(),
      fileName: z.string().optional(),
      lineItems: z
        .array(
          z.object({
            description: z.string(),
            amount: z.number(),
          }),
        )
        .optional(),
    }),
    handler: async (args) => {
      finance.setTab("documents");
      docs.applyExtraction({
        id: args.id,
        vendor: args.vendor,
        amount: args.amount,
        date: args.date,
        category: args.category,
        source: args.source as InvoiceSource,
        confidence: args.confidence,
        fileName: args.fileName,
        lineItems: args.lineItems ?? [],
      });
      return `Applied ${args.id} to the Documents canvas.`;
    },
  });

  useHumanInTheLoop({
    name: "approveExpense",
    agentId: "documents",
    description:
      "Human-in-the-loop approval for an extracted invoice or receipt. Never mark approved without this tool.",
    parameters: z.object({
      id: z.string(),
      vendor: z.string(),
      amount: z.number(),
      reason: z.string(),
    }),
    render: ({ args, respond, status }) => (
      <ApproveExpenseHitl args={args} status={status} respond={respond} />
    ),
  });

  return null;
}
