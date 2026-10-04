"use client";

import {
  GEN_UI_MODULES,
  GEN_UI_SPECTRUM,
  type GenUiModule,
  type GenUiSpectrum,
} from "../../lib/gen-ui-modules";
import { cn } from "../../lib/utils";

const SPECTRUM_ACCENT: Record<GenUiSpectrum, string> = {
  controlled: "#6b7280",
  declarative: "#111318",
  open: "#374151",
};

export function CapabilityChart({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (module: GenUiModule) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Generative UI spectrum
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Pick a module to see how CopilotKit maps AG-UI capabilities to chat
          surfaces. Columns run from controlled components → A2UI catalog →
          open sandbox.
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {GEN_UI_SPECTRUM.map((col) => (
            <div key={col.id} className="min-w-0">
              <div
                className="mb-2 rounded-lg px-2 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-white"
                style={{ background: SPECTRUM_ACCENT[col.id] }}
              >
                {col.label}
              </div>
              <p className="mb-3 min-h-[2.5rem] px-1 text-[11px] leading-4 text-[var(--muted)]">
                {col.tagline}
              </p>
              <ul className="space-y-2">
                {GEN_UI_MODULES.filter((m) => m.spectrum === col.id).map(
                  (mod) => (
                    <ModuleNode
                      key={mod.id}
                      module={mod}
                      selected={selectedId === mod.id}
                      onSelect={() => onSelect(mod)}
                    />
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--chip)] p-3 sm:block">
        <svg
          viewBox="0 0 720 120"
          className="h-auto w-full text-[var(--line-strong)]"
          aria-hidden
        >
          <defs>
            <linearGradient id="specGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ca3af" />
              <stop offset="50%" stopColor="#4b5563" />
              <stop offset="100%" stopColor="#111318" />
            </linearGradient>
          </defs>
          <rect
            x="24"
            y="48"
            width="672"
            height="12"
            rx="6"
            fill="url(#specGrad)"
            opacity="0.35"
          />
          {[
            { x: 80, label: "Tool render" },
            { x: 280, label: "A2UI charts" },
            { x: 520, label: "Sandbox iframe" },
          ].map(({ x, label }) => (
            <g key={label}>
              <circle cx={x} cy={54} r="8" fill="#111318" />
              <text
                x={x}
                y={88}
                textAnchor="middle"
                className="fill-[#8a8f98] text-[11px] font-medium"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {label}
              </text>
            </g>
          ))}
          <path
            d="M 88 54 L 272 54"
            stroke="#111318"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 288 54 L 512 54"
            stroke="#4b5563"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>
    </div>
  );
}

function ModuleNode({
  module,
  selected,
  onSelect,
}: {
  module: GenUiModule;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-full rounded-xl border px-3 py-2.5 text-left transition",
          selected
            ? "border-[var(--ink)] bg-white shadow-sm"
            : "border-[var(--line)] bg-[var(--chip)] hover:border-[var(--line-strong)]",
        )}
      >
        <p className="text-sm font-semibold text-[var(--text-ink)]">
          {module.title}
        </p>
        <p className="mt-0.5 text-[11px] leading-4 text-[var(--muted)]">
          {module.description}
        </p>
        <p className="mt-1.5 font-mono text-[10px] text-[var(--accent)]">
          {module.tool}
          {module.catalogComponents.length > 0
            ? ` · ${module.catalogComponents.slice(0, 2).join(", ")}${module.catalogComponents.length > 2 ? "…" : ""}`
            : ""}
        </p>
      </button>
    </li>
  );
}
