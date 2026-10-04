"use client";

import {
  CHARGE_STATUS_BREAKDOWN,
  MAY_2026_BY_VENDOR,
  MONTHLY_SPEND_2026,
  TEAM_SPEND_BY_MONTH,
} from "../../lib/chart-demo-data";
import { type GenUiModule } from "../../lib/gen-ui-modules";
import { HeroBanner } from "../shell/HeroBanner";
import { CapabilityChart } from "./CapabilityChart";
import { StaticChartPreview } from "./StaticChartPreview";

export function PlaygroundCanvas({
  selected,
  onSelect,
}: {
  selected: GenUiModule | null;
  onSelect: (module: GenUiModule) => void;
}) {

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-7 py-6">
      <HeroBanner
        kicker="Welcome back"
        title="Gen UI playground"
        subtitle="Controlled tools, A2UI charts, and sandboxed HTML — pick a module, then run it in chat."
        actions={
          <>
            <span className="inline-flex items-center rounded-full bg-[var(--ink)] px-4 py-2 text-[13px] font-medium text-white">
              + New module
            </span>
            <a
              href="/analytics"
              className="inline-flex items-center rounded-full border border-[var(--line-strong)] px-4 py-2 text-[13px] font-medium"
            >
              Open analytics
            </a>
          </>
        }
      />

      <CapabilityChart
        selectedId={selected?.id ?? null}
        onSelect={onSelect}
      />

      {selected ? (
        <section className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Selected module
          </p>
          <h2 className="mt-1 text-lg font-semibold">{selected.title}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{selected.description}</p>
          <div className="mt-4 rounded-xl bg-[var(--chip)] p-3">
            <p className="text-[10px] font-semibold uppercase text-[var(--muted)]">
              Demo prompt
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--text-ink)]">
              {selected.demoPrompt}
            </p>
          </div>
          <StaticChartPreview moduleId={selected.id} />
        </section>
      ) : (
        <p className="text-center text-sm text-[var(--muted)]">
          Select a module in the chart above to see a reference preview and demo
          prompt.
        </p>
      )}

      <section className="rounded-[24px] border border-[var(--line)] bg-[var(--chip)] p-4 text-xs text-[var(--muted)]">
        <p className="font-semibold text-[var(--text-ink)]">Sample data</p>
        <p className="mt-1">
          May vendors:{" "}
          {MAY_2026_BY_VENDOR.map((d) => `${d.label} $${d.value.toLocaleString()}`).join(" · ")}
        </p>
        <p className="mt-1">
          Monthly trend: {MONTHLY_SPEND_2026.length} months · stacked teams:{" "}
          {TEAM_SPEND_BY_MONTH.rows.length} periods · status mix:{" "}
          {CHARGE_STATUS_BREAKDOWN.map((s) => s.label).join(", ")}.
        </p>
      </section>
    </article>
  );
}
