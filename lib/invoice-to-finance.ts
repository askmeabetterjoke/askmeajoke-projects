import type { Charge, LedgerEntry } from "./finance-data";
import type { InvoiceRecord } from "./invoice-ledger-store";

export function invoiceToCharge(inv: InvoiceRecord): Charge {
  return {
    id: `inv-${inv.id}`,
    merchant: inv.vendor,
    category: inv.category,
    team: "Operations",
    date: inv.date,
    status: "Approved",
    amount: inv.amount,
    cardLast4: "4242",
    note: `Document intake (${inv.source}) · ${inv.fileName ?? inv.id}`,
  };
}

export function invoiceToLedgerEntry(inv: InvoiceRecord): LedgerEntry {
  return {
    id: `led-${inv.id}`,
    merchant: inv.vendor,
    kind: "Outgoing",
    date: inv.date,
    amount: inv.amount,
    note: `Approved ${inv.source} ${inv.id}`,
  };
}
