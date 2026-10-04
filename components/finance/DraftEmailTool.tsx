"use client";

import { EmailDraftCard } from "../EmailDraftCard";

type DraftEmailToolProps = {
  args: Partial<{
    to: string;
    cc: string;
    subject: string;
    body: string;
  }>;
  status: "inProgress" | "executing" | "complete";
};

export function DraftEmailTool({ args, status }: DraftEmailToolProps) {
  return (
    <EmailDraftCard
      to={args.to}
      cc={args.cc}
      subject={args.subject}
      body={
        args.body ||
        (status === "complete" ? undefined : "Writing the email from live spend data…")
      }
    />
  );
}
