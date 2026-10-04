"use client";

import { useUiCatalog } from "./UiCatalogProvider";

export function ReplaySandboxCard({ id }: { id?: string }) {
  const catalog = useUiCatalog();
  const entry = id ? catalog.get(id) : undefined;
  if (!entry) {
    return (
      <p className="studio-tool-card studio-card-note rounded-2xl p-3 text-sm">
        Catalog entry not found.
      </p>
    );
  }

  if (entry.kind === "a2ui") {
    return (
      <div className="studio-tool-card rounded-2xl p-4">
        <p className="studio-card-kicker">A2UI recipe</p>
        <p className="studio-card-label mt-1 font-semibold">{entry.title}</p>
        <p className="studio-card-note mt-1">{entry.description}</p>
        <p className="mt-2 font-mono text-[11px] text-[var(--text-ink)]">
          {entry.a2ui?.components.join(" · ")}
        </p>
        <p className="studio-card-note mt-2">
          Replay by calling generate_a2ui with those catalog components — do not
          regenerate HTML.
        </p>
      </div>
    );
  }

  const htmlDoc = buildSrcDoc(entry.sandbox);
  return (
    <div className="studio-tool-card overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-3 py-2">
        <div>
          <p className="studio-card-kicker">Reused from catalog</p>
          <p className="studio-card-label font-semibold">{entry.title}</p>
        </div>
        <span className="studio-card-note text-[11px]">
          {entry.reuseCount} reuse{entry.reuseCount === 1 ? "" : "s"}
        </span>
      </div>
      <iframe
        title={entry.title}
        sandbox="allow-scripts"
        className="h-[380px] w-full border-0 bg-white"
        srcDoc={htmlDoc}
      />
    </div>
  );
}

function buildSrcDoc(sandbox?: {
  css?: string;
  html?: string;
  jsFunctions?: string;
  jsExpressions?: string[];
}) {
  const css = sandbox?.css ?? "";
  const html = sandbox?.html ?? "";
  const fns = sandbox?.jsFunctions ?? "";
  const exprs = (sandbox?.jsExpressions ?? []).join(";\n");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>${css}</style></head><body>${html}<script>${fns}\n${exprs}</script></body></html>`;
}
