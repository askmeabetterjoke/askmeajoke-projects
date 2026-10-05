"use client";

import type { CSSProperties } from "react";

type HitlActionButtonsProps = {
  canRespond: boolean;
  onApprove: () => void;
  onDeny: () => void;
  approveLabel?: string;
  denyLabel?: string;
  busy?: boolean;
};

const approveStyle = (enabled: boolean): CSSProperties => ({
  backgroundColor: enabled ? "#111318" : "#4b5563",
  color: "#ffffff",
  WebkitTextFillColor: "#ffffff",
  border: `1px solid ${enabled ? "#000000" : "#374151"}`,
  borderRadius: 9999,
  padding: "6px 16px",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.25,
  boxShadow: "0 1px 2px rgb(44 42 38 / 0.12)",
  cursor: enabled ? "pointer" : "wait",
  opacity: 1,
});

const denyStyle = (enabled: boolean): CSSProperties => ({
  backgroundColor: enabled ? "#ffffff" : "#f1f3f6",
  color: "#111318",
  WebkitTextFillColor: "#111318",
  border: "1px solid #e2e5ea",
  borderRadius: 9999,
  padding: "6px 16px",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.25,
  boxShadow: "0 1px 2px rgb(44 42 38 / 0.06)",
  cursor: enabled ? "pointer" : "wait",
  opacity: 1,
});

export function HitlActionButtons({
  canRespond,
  onApprove,
  onDeny,
  approveLabel = "Approve",
  denyLabel = "Deny",
  busy,
}: HitlActionButtonsProps) {
  return (
    <div className="mt-3 flex gap-2">
      <button
        type="button"
        disabled={!canRespond}
        aria-busy={busy}
        className="approval-hitl-approve"
        style={approveStyle(canRespond)}
        onClick={() => {
          if (!canRespond) return;
          onApprove();
        }}
      >
        {approveLabel}
      </button>
      <button
        type="button"
        disabled={!canRespond}
        className="approval-hitl-deny"
        style={denyStyle(canRespond)}
        onClick={() => {
          if (!canRespond) return;
          onDeny();
        }}
      >
        {denyLabel}
      </button>
    </div>
  );
}
