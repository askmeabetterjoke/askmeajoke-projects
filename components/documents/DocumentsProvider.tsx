"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEMO_INVOICES } from "../../lib/demo-invoices";
import {
  ensureDemoLedgerSeeded,
  readInvoiceLedger,
  type InvoiceRecord,
  upsertInvoice,
} from "../../lib/invoice-ledger-store";

type DocumentsState = {
  inbox: InvoiceRecord[];
  selectedId: string | null;
  select: (id: string) => void;
  applyExtraction: (record: Omit<InvoiceRecord, "status" | "updatedAt">) => void;
  refresh: () => void;
};

const DocumentsContext = createContext<DocumentsState | null>(null);

function seedIfEmpty() {
  ensureDemoLedgerSeeded(DEMO_INVOICES);
  return readInvoiceLedger();
}

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [inbox, setInbox] = useState<InvoiceRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const rows = seedIfEmpty();
    setInbox(rows);
    setSelectedId((prev) => prev ?? rows[0]?.id ?? null);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("agui-invoice-ledger-changed", onChange);
    return () =>
      window.removeEventListener("agui-invoice-ledger-changed", onChange);
  }, [refresh]);

  const applyExtraction = useCallback(
    (record: Omit<InvoiceRecord, "status" | "updatedAt">) => {
      upsertInvoice({
        ...record,
        status: "extracted",
        updatedAt: Date.now(),
      });
      setSelectedId(record.id);
      refresh();
    },
    [refresh],
  );

  const value = useMemo(
    () => ({
      inbox,
      selectedId,
      select: setSelectedId,
      applyExtraction,
      refresh,
    }),
    [inbox, selectedId, applyExtraction, refresh],
  );

  return (
    <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const ctx = useContext(DocumentsContext);
  if (!ctx) {
    throw new Error("useDocuments must be used inside DocumentsProvider");
  }
  return ctx;
}
