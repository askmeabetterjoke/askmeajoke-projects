"use client";

import { useEffect } from "react";
import { matchChargeRef } from "../../lib/charge-match";
import { money } from "../../lib/utils";
import { useFinance } from "./FinanceProvider";
import { HitlActionButtons } from "./HitlActionButtons";

type HitlStatus = "inProgress" | "executing" | "complete";

type ApproveChargeHitlProps = {
  args: Partial<{
    merchantOrId: string;
    amount: number;
    reason: string;
  }>;
  status: HitlStatus;
  respond?: (result: unknown) => Promise<void>;
};

export function ApproveChargeHitl({
  args,
  status,
  respond,
}: ApproveChargeHitlProps) {
  const finance = useFinance();
  const ref = args.merchantOrId ?? "";
  const amount = args.amount ?? 0;
  const matched = matchChargeRef(finance.charges, ref, amount || undefined);

  useEffect(() => {
    if (status === "inProgress" || status === "executing") {
      finance.focusChargeForApproval(ref, amount || undefined);
    }
  }, [status, ref, amount, finance.focusChargeForApproval]);

  if (status === "complete") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
        Charge approval finished for {matched?.merchant ?? ref}.
      </div>
    );
  }

  /** `respond` is only defined once the tool call is ready (after inProgress). */
  const canRespond = Boolean(respond);
  const label = matched?.merchant ?? ref;
  const displayAmount = matched?.amount ?? amount;

  return (
    <div className="approval-hitl-card studio-tool-card rounded-xl p-3 text-sm">
      <p className="approval-hitl-title font-semibold">Approval needed</p>
      <p className="approval-hitl-muted mt-1">
        {label}
        {matched ? ` (${matched.id})` : ""} · {money(displayAmount)}
      </p>
      {matched ? (
        <p className="approval-hitl-muted mt-0.5 text-xs">
          Status: {matched.status} · {matched.team}
        </p>
      ) : null}
      <p className="approval-hitl-muted mt-1 text-xs">{args.reason}</p>
      <p className="approval-hitl-hint mt-2 text-xs">
        The Charges tab on the right is focused on this row.
      </p>
      <HitlActionButtons
        canRespond={canRespond}
        busy={status === "inProgress"}
        onApprove={() => {
          finance.approveCharge(ref, amount || undefined);
          void respond!(
            `Alex approved ${matched?.id ?? ref} (${label}). Marked Approved.`,
          );
        }}
        onDeny={() => {
          void respond!(
            `Alex denied ${matched?.id ?? ref}. Left unchanged pending review.`,
          );
        }}
      />
      {status === "inProgress" ? (
        <p className="approval-hitl-muted mt-2 text-xs">
          Preparing approval… buttons activate in a moment.
        </p>
      ) : null}
    </div>
  );
}
