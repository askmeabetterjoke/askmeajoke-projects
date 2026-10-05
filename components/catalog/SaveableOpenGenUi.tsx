"use client";

import type { OpenGenerativeUIContent } from "@copilotkit/react-core/v2";
import { StudioOpenGenerativeUIActivityRenderer } from "../open-gen-ui/StudioOpenGenerativeUIRenderer";
import { useEffect, useState } from "react";
import { hashContent } from "../../lib/ui-catalog-store";
import { useUiCatalog } from "./UiCatalogProvider";

function htmlFromContent(content: OpenGenerativeUIContent): string {
  if (Array.isArray(content.html)) return content.html.join("\n");
  return typeof content.html === "string" ? content.html : "";
}

export function SaveableOpenGenUi({
  activityType,
  content,
  message,
  agent,
}: {
  activityType: string;
  content: OpenGenerativeUIContent;
  message: unknown;
  agent: unknown;
}) {
  const catalog = useUiCatalog();
  const html = htmlFromContent(content);
  const css = content.css ?? "";
  const complete = Boolean(
    content.htmlComplete || content.generating === false,
  );
  const contentHash = html ? hashContent(`${css}\n${html}`) : "";
  const already = catalog.entries.find((e) => e.contentHash === contentHash);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (already?.id) setSavedId(already.id);
  }, [already?.id]);

  useEffect(() => {
    if (!complete || !html || savedId || already?.id) return;
    const entry = catalog.saveSandbox({
      html,
      css,
      jsFunctions: content.jsFunctions,
      jsExpressions: content.jsExpressions,
      intent: "open generative UI (auto-saved after first generate)",
    });
    setSavedId(entry.id);
  }, [
    already?.id,
    catalog,
    complete,
    content.jsExpressions,
    content.jsFunctions,
    css,
    html,
    savedId,
  ]);

  return (
    <div className="space-y-2">
      <StudioOpenGenerativeUIActivityRenderer
        activityType={activityType}
        content={content}
        message={message}
        agent={agent}
      />
      {complete && html ? (
        <div className="studio-tool-card flex items-center justify-between rounded-2xl bg-[var(--chip)] px-3 py-2 text-[12px]">
          <p className="studio-card-note text-[var(--text-muted)]">
            {savedId
              ? "Saved to UI catalog — next similar ask can replay this instead of regenerating."
              : "Ready to keep this surface in the catalog."}
          </p>
          {savedId ? (
            <span className="rounded-full bg-[var(--ink)] px-2 py-0.5 text-[10px] font-medium text-white">
              Catalog
            </span>
          ) : (
            <button
              type="button"
              className="rounded-full bg-[var(--ink)] px-3 py-1 text-[11px] font-medium text-white"
              onClick={() => {
                const entry = catalog.saveSandbox({
                  html,
                  css,
                  jsFunctions: content.jsFunctions,
                  jsExpressions: content.jsExpressions,
                });
                setSavedId(entry.id);
              }}
            >
              Save to catalog
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
