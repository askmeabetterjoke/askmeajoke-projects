"use client";

import { useEffect } from "react";
import { money } from "../../lib/utils";
import { approveInvoice, rejectInvoice } from "../../lib/invoice-ledger-store";
import { useDocuments } from "./DocumentsProvider";
import { HitlActionButtons } from "../finance/HitlActionButtons";

type HitlStatus = "inProgress" | "executing" | "complete";

type ApproveExpenseHitlProps = {
  args: Partial<{
    id: string;
    vendor: string;
    amount: number;
    reason: string;
  }>;
  status: HitlStatus;
  respond?: (result: unknown) => Promise<void>;
};

export function ApproveExpenseHitl({
  args,
  status,
  respond,
}: ApproveExpenseHitlProps) {
  const docs = useDocuments();
  const id = args.id ?? "";
  const vendor = args.vendor ?? "Vendor";
  const amount = args.amount ?? 0;
  const reason = args.reason ?? "Policy review";

  useEffect(() => {
    if (id) docs.select(id);
  }, [id, docs.select]);

  if (status === "complete") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
        Expense approval finished for {vendor} ({id}).
      </div>
    );
  }

  const canRespond = Boolean(respond);

  return (
    <div className="approval-hitl-card studio-tool-card rounded-xl p-3 text-sm">
      <p className="font-medium text-[var(--ink)]">Approve expense</p>
      <p className="approval-hitl-muted mt-1">
        {vendor} · {money(amount)} · {id}
      </p>
      <p className="approval-hitl-title mt-2 text-[13px] leading-snug">{reason}</p>
      <HitlActionButtons
        canRespond={canRespond}
        onApprove={() => {
          approveInvoice(id);
          docs.refresh();
          void respond?.({ approved: true, id });
        }}
        onDeny={() => {
          rejectInvoice(id);
          docs.refresh();
          void respond?.({ approved: false, id });
        }}
      />
    </div>
  );
}
