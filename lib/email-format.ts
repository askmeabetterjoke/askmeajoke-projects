export type EmailDraft = {
  to?: string;
  cc?: string;
  subject?: string;
  body?: string;
};

export function formatEmailPlaintext(draft: EmailDraft) {
  const lines = [
    draft.to ? `To: ${draft.to}` : null,
    draft.cc ? `Cc: ${draft.cc}` : null,
    draft.subject ? `Subject: ${draft.subject}` : null,
    draft.body ? `\n${draft.body}` : null,
  ].filter((line): line is string => Boolean(line));
  return lines.join("\n").trim();
}
