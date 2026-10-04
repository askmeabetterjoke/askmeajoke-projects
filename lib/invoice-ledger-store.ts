export type InvoiceSource = "invoice" | "receipt";

export type InvoiceStatus = "extracted" | "approved" | "rejected";

export type InvoiceLineItem = {
  description: string;
  amount: number;
};

export type InvoiceRecord = {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  category: string;
  lineItems: InvoiceLineItem[];
  source: InvoiceSource;
  status: InvoiceStatus;
  confidence: number;
  fileName?: string;
  updatedAt: number;
};

const STORAGE_KEY = "agui-studio-invoice-ledger";

let seeded = false;

function canUseStorage() {
  return typeof window !== "undefined";
}

export function ensureDemoLedgerSeeded(
  seeds: InvoiceRecord[],
) {
  if (!canUseStorage() || seeded) return;
  if (readInvoiceLedger().length > 0) {
    seeded = true;
    return;
  }
  for (const inv of seeds) {
    upsertInvoice(inv);
  }
  seeded = true;
}

export function readInvoiceLedger(): InvoiceRecord[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InvoiceRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeInvoiceLedger(entries: InvoiceRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("agui-invoice-ledger-changed"));
}

export function upsertInvoice(record: InvoiceRecord) {
  const rows = readInvoiceLedger();
  const idx = rows.findIndex((r) => r.id === record.id);
  const next =
    idx >= 0
      ? rows.map((r, i) => (i === idx ? record : r))
      : [...rows, record];
  writeInvoiceLedger(next);
}

export function approveInvoice(id: string) {
  const rows = readInvoiceLedger();
  writeInvoiceLedger(
    rows.map((r) =>
      r.id === id
        ? { ...r, status: "approved" as const, updatedAt: Date.now() }
        : r,
    ),
  );
}

export function rejectInvoice(id: string) {
  const rows = readInvoiceLedger();
  writeInvoiceLedger(
    rows.map((r) =>
      r.id === id
        ? { ...r, status: "rejected" as const, updatedAt: Date.now() }
        : r,
    ),
  );
}

export function ledgerSummary(entries: InvoiceRecord[]) {
  return entries.map((e) => ({
    id: e.id,
    vendor: e.vendor,
    amount: e.amount,
    date: e.date,
    status: e.status,
    source: e.source,
    category: e.category,
  }));
}

export function approvedInvoices(entries: InvoiceRecord[]) {
  return entries.filter((e) => e.status === "approved");
}
