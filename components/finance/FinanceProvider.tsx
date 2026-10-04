"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { matchChargeRef } from "../../lib/charge-match";
import { DEMO_INVOICES } from "../../lib/demo-invoices";
import {
  approvedInvoices,
  ensureDemoLedgerSeeded,
  readInvoiceLedger,
} from "../../lib/invoice-ledger-store";
import {
  invoiceToCharge,
  invoiceToLedgerEntry,
} from "../../lib/invoice-to-finance";
import {
  CARDS,
  CHARGES,
  LEDGER,
  type CardAccount,
  type Charge,
  type ChargeStatus,
  type DashboardTab,
  type LedgerEntry,
} from "../../lib/finance-data";

function mergeApprovedInvoiceRows(
  baseCharges: Charge[],
  baseLedger: LedgerEntry[],
) {
  const approved = approvedInvoices(readInvoiceLedger());
  const invCharges = approved.map(invoiceToCharge);
  const invLedger = approved.map(invoiceToLedgerEntry);
  const chargeIds = new Set(baseCharges.map((c) => c.id));
  const ledgerIds = new Set(baseLedger.map((l) => l.id));
  return {
    charges: [
      ...baseCharges,
      ...invCharges.filter((c) => !chargeIds.has(c.id)),
    ],
    ledger: [
      ...baseLedger,
      ...invLedger.filter((l) => !ledgerIds.has(l.id)),
    ],
  };
}

type ChargeFilter = {
  sort: "most-expensive" | "newest";
  show: "all" | "top10";
  status: ChargeStatus | "all";
  search: string;
};

type FinanceState = {
  tab: DashboardTab;
  setTab: (tab: DashboardTab) => void;
  cards: CardAccount[];
  charges: Charge[];
  ledger: LedgerEntry[];
  filter: ChargeFilter;
  setFilter: (patch: Partial<ChargeFilter>) => void;
  visibleCharges: Charge[];
  flagTransaction: (id: string, note: string) => void;
  addNote: (id: string, note: string) => void;
  approveCharge: (id: string) => void;
  highlightChargeId: string | null;
  focusChargeForApproval: (merchantOrId: string, amountHint?: number) => void;
};

const FinanceContext = createContext<FinanceState | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<DashboardTab>("overview");
  const [charges, setCharges] = useState(() =>
    mergeApprovedInvoiceRows(CHARGES, LEDGER).charges,
  );
  const [ledger, setLedger] = useState(() =>
    mergeApprovedInvoiceRows(CHARGES, LEDGER).ledger,
  );

  useEffect(() => {
    const sync = () => {
      ensureDemoLedgerSeeded(DEMO_INVOICES);
      const merged = mergeApprovedInvoiceRows(CHARGES, LEDGER);
      setCharges(merged.charges);
      setLedger(merged.ledger);
    };
    sync();
    window.addEventListener("agui-invoice-ledger-changed", sync);
    return () =>
      window.removeEventListener("agui-invoice-ledger-changed", sync);
  }, []);
  const [filter, setFilterState] = useState<ChargeFilter>({
    sort: "most-expensive",
    show: "all",
    status: "all",
    search: "",
  });
  const [highlightChargeId, setHighlightChargeId] = useState<string | null>(
    null,
  );

  const setFilter = useCallback((patch: Partial<ChargeFilter>) => {
    setFilterState((prev) => ({ ...prev, ...patch }));
  }, []);

  const visibleCharges = useMemo(() => {
    let rows = [...charges];
    if (filter.status !== "all") {
      rows = rows.filter((c) => c.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.merchant.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.team.toLowerCase().includes(q),
      );
    }
    rows.sort((a, b) =>
      filter.sort === "newest"
        ? b.date.localeCompare(a.date)
        : b.amount - a.amount,
    );
    if (filter.show === "top10") rows = rows.slice(0, 10);
    return rows;
  }, [charges, filter]);

  const flagTransaction = useCallback((id: string, note: string) => {
    setLedger((rows) =>
      rows.map((row) =>
        row.id === id || row.merchant.toLowerCase().includes(id.toLowerCase())
          ? { ...row, flagged: true, note }
          : row,
      ),
    );
    setCharges((rows) =>
      rows.map((row) =>
        row.id === id || row.merchant.toLowerCase().includes(id.toLowerCase())
          ? { ...row, status: "Flagged", note }
          : row,
      ),
    );
  }, []);

  const addNote = useCallback((id: string, note: string) => {
    setLedger((rows) =>
      rows.map((row) =>
        row.id === id || row.merchant.toLowerCase().includes(id.toLowerCase())
          ? { ...row, note }
          : row,
      ),
    );
    setCharges((rows) =>
      rows.map((row) =>
        row.id === id || row.merchant.toLowerCase().includes(id.toLowerCase())
          ? { ...row, note }
          : row,
      ),
    );
  }, []);

  const focusChargeForApproval = useCallback(
    (merchantOrId: string, amountHint?: number) => {
      const charge = matchChargeRef(charges, merchantOrId, amountHint);
      setTab("charges");
      setFilterState((prev) => ({
        ...prev,
        sort: "most-expensive",
        show: "all",
        status: "all",
        search: charge?.merchant ?? merchantOrId,
      }));
      setHighlightChargeId(charge?.id ?? null);
    },
    [charges],
  );

  const approveCharge = useCallback(
    (ref: string, amountHint?: number) => {
      const charge = matchChargeRef(charges, ref, amountHint);
      const key = charge?.id ?? ref;
      setCharges((rows) =>
        rows.map((row) =>
          row.id === key ||
          row.merchant.toLowerCase().includes(key.toLowerCase()) ||
          (charge && row.id === charge.id)
            ? { ...row, status: "Approved" }
            : row,
        ),
      );
      if (charge) setHighlightChargeId(charge.id);
      setTab("charges");
    },
    [charges],
  );

  const value = useMemo(
    () => ({
      tab,
      setTab,
      cards: CARDS,
      charges,
      ledger,
      filter,
      setFilter,
      visibleCharges,
      flagTransaction,
      addNote,
      approveCharge,
      highlightChargeId,
      focusChargeForApproval,
    }),
    [
      tab,
      charges,
      ledger,
      filter,
      setFilter,
      visibleCharges,
      flagTransaction,
      addNote,
      approveCharge,
      highlightChargeId,
      focusChargeForApproval,
    ],
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
}
