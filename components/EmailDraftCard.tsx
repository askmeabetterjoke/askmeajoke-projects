"use client";

import { useCallback, useState } from "react";
import { formatEmailPlaintext } from "../lib/email-format";

type EmailDraftCardProps = {
  to?: string;
  cc?: string;
  subject?: string;
  body?: string;
  compact?: boolean;
};

export function EmailDraftCard({
  to,
  cc,
  subject,
  body,
  compact = false,
}: EmailDraftCardProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    const text = formatEmailPlaintext({ to, cc, subject, body });
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [to, cc, subject, body]);

  return (
    <div
      className={`email-draft-card studio-tool-card overflow-hidden rounded-xl text-sm ${
        compact ? "max-w-full" : ""
      }`}
    >
      <div className="email-draft-header flex items-center justify-between border-b border-[var(--line)] px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide">Email draft</p>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!to && !subject && !body}
          className="email-draft-copy studio-btn-primary rounded-full px-4 py-1.5 text-xs disabled:cursor-not-allowed"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <dl className="space-y-1.5 bg-[var(--surface)] px-3 py-2.5">
        <EmailField label="To" value={to} />
        {cc ? <EmailField label="Cc" value={cc} /> : null}
        <EmailField label="Subject" value={subject} />
      </dl>
      <div className="max-h-44 overflow-auto border-t border-[var(--line)] bg-[var(--surface)] px-3 py-3">
        <p className="email-draft-body whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--text-ink)]">
          {body || "Composing…"}
        </p>
      </div>
    </div>
  );
}

function EmailField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-2 text-xs">
      <dt className="w-14 shrink-0">{label}</dt>
      <dd className="min-w-0 break-words font-normal text-[var(--text-ink)]">
        {value || "—"}
      </dd>
    </div>
  );
}
