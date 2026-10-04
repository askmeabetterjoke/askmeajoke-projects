import type { InvoiceRecord } from "./invoice-ledger-store";

export const DEMO_INVOICES: InvoiceRecord[] = [
  {
    id: "INV-1042",
    vendor: "Amazon Web Services",
    amount: 4280,
    date: "2026-05-12",
    category: "Cloud infrastructure",
    source: "invoice",
    status: "extracted",
    confidence: 0.94,
    fileName: "aws-consulting-may.pdf",
    lineItems: [
      { description: "Reserved instance true-up", amount: 3200 },
      { description: "Support plan", amount: 1080 },
    ],
    updatedAt: Date.now(),
  },
  {
    id: "INV-2091",
    vendor: "Delta Airlines",
    amount: 428,
    date: "2026-05-18",
    category: "Travel",
    source: "receipt",
    status: "extracted",
    confidence: 0.91,
    fileName: "delta-receipt-sfo.pdf",
    lineItems: [{ description: "SFO → ORD economy", amount: 428 }],
    updatedAt: Date.now(),
  },
  {
    id: "INV-3300",
    vendor: "Acme Office Supply",
    amount: 1240,
    date: "2026-05-20",
    category: "Office",
    source: "invoice",
    status: "extracted",
    confidence: 0.88,
    fileName: "acme-q2-supplies.pdf",
    lineItems: [
      { description: "Standing desks (2)", amount: 980 },
      { description: "Monitor arms", amount: 260 },
    ],
    updatedAt: Date.now(),
  },
  {
    id: "INV-5501",
    vendor: "Stripe, Inc.",
    amount: 875.5,
    date: "2026-05-22",
    category: "Payment processing",
    source: "invoice",
    status: "extracted",
    confidence: 0.92,
    fileName: "stripe-may-processing.pdf",
    lineItems: [
      { description: "Payment processing fees (May)", amount: 825.5 },
      { description: "Radar fraud screening", amount: 50 },
    ],
    updatedAt: Date.now(),
  },
];

export function findDemoInvoice(id: string) {
  const key = id.trim().toUpperCase();
  return DEMO_INVOICES.find(
    (inv) => inv.id.toUpperCase() === key || inv.vendor.toLowerCase().includes(id.toLowerCase()),
  );
}
