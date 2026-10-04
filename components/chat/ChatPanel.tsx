"use client";

import { useCallback, useEffect, useMemo } from "react";
import { CopilotChat, useAgent } from "@copilotkit/react-core/v2";
import { fileToDataAttachment } from "../../lib/file-to-data-attachment";
import { trimAgentHistory } from "../../lib/trim-agent-history";
import { useFinance } from "../finance/FinanceProvider";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPT_MIME = "image/*,application/pdf";

export function ChatPanel() {
  const finance = useFinance();
  const onUpload = useCallback(fileToDataAttachment, []);
  const documentsMode = finance.tab === "documents";
  const agentId = documentsMode ? "documents" : "analytics";
  const { agent: analyticsAgent } = useAgent({ agentId: "analytics" });
  const { agent: documentsAgent } = useAgent({ agentId: "documents" });

  useEffect(() => {
    if (analyticsAgent) trimAgentHistory(analyticsAgent);
    if (documentsAgent) trimAgentHistory(documentsAgent);
  }, [agentId, analyticsAgent, documentsAgent]);

  const labels = useMemo(
    () =>
      documentsMode
        ? {
            title: "Northwind Copilot",
            welcome:
              "Document intake (Agno): attach PDFs or ask to extract INV-1042, INV-2091, INV-3300, or INV-5501.",
            placeholder: "Attach a PDF or describe an invoice…",
          }
        : {
            title: "Northwind Copilot",
            welcome:
              "Ask about spend, approvals, and charts — or open Demo in the header for a guided walkthrough.",
            placeholder: "Ask about charges, HITL, or charts…",
          },
    [documentsMode],
  );

  return (
    <div className="studio-chat-panel flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        <CopilotChat
          agentId={agentId}
          className="h-full min-h-0"
          labels={{
            modalHeaderTitle: labels.title,
            welcomeMessageText: labels.welcome,
            chatInputPlaceholder: labels.placeholder,
          }}
          attachments={
            documentsMode
              ? {
                  enabled: true,
                  accept: ACCEPT_MIME,
                  maxSize: MAX_FILE_SIZE_BYTES,
                  onUpload,
                  onUploadFailed: (err) => {
                    console.warn("[documents] attachment rejected", err);
                  },
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
