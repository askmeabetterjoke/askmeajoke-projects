"use client";

import { ledgerSummary } from "../../lib/invoice-ledger-store";
import { money } from "../../lib/utils";
import { useDocuments } from "./DocumentsProvider";

export function DocumentsCanvas() {
  const { inbox, selectedId, select } = useDocuments();
  const selected = inbox.find((r) => r.id === selectedId) ?? inbox[0];
  const summary = ledgerSummary(inbox);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-auto p-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Document inbox</h2>
        <p className="text-[13px] text-[var(--muted)]">
          Extracted invoices and receipts awaiting approval. Approved rows sync
          to Analytics charges.
        </p>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Queue
          </p>
          <ul className="mt-2 space-y-1">
            {summary.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => select(row.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] transition ${
                    row.id === selected?.id
                      ? "bg-[var(--chip)] font-medium"
                      : "hover:bg-[var(--chip)]/60"
                  }`}
                >
                  <span className="truncate">
                    {row.vendor}{" "}
                    <span className="text-[var(--muted)]">· {row.id}</span>
                  </span>
                  <span className="shrink-0 pl-2">{money(row.amount)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
          {selected ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
                    Extraction
                  </p>
                  <h3 className="text-base font-semibold">{selected.vendor}</h3>
                  <p className="text-[13px] text-[var(--muted)]">
                    {selected.id} · {selected.source} ·{" "}
                    {Math.round(selected.confidence * 100)}% confidence
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    selected.status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : selected.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <dt className="text-[var(--muted)]">Amount</dt>
                  <dd className="font-medium">{money(selected.amount)}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Date</dt>
                  <dd className="font-medium">{selected.date}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Category</dt>
                  <dd className="font-medium">{selected.category}</dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">File</dt>
                  <dd className="truncate font-medium">
                    {selected.fileName ?? "—"}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
                Line items
              </p>
              <ul className="mt-2 space-y-1 text-[13px]">
                {selected.lineItems.map((line) => (
                  <li
                    key={`${line.description}-${line.amount}`}
                    className="flex justify-between gap-2 border-b border-[var(--line)]/60 py-1 last:border-0"
                  >
                    <span>{line.description}</span>
                    <span className="shrink-0">{money(line.amount)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-[13px] text-[var(--muted)]">
              No documents yet. Ask the copilot to extract a sample invoice.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
