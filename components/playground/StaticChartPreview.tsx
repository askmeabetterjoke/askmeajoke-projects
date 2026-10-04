"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CHARGE_STATUS_BREAKDOWN,
  MAY_2026_BY_VENDOR,
  MONTHLY_SPEND_2026,
  TEAM_SPEND_BY_MONTH,
} from "../../lib/chart-demo-data";

const COLORS = ["#111318", "#4b5563", "#9ca3af", "#d1d5db", "#6b7280"];
const STACK_COLORS = ["#111318", "#4b5563", "#9ca3af", "#e5e7eb"];

function renderPreviewChart(moduleId: string) {
  if (moduleId === "a2ui-bar") {
    return (
      <BarChart data={[...MAY_2026_BY_VENDOR]}>
        <CartesianGrid stroke="#eceef2" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#111318" radius={[4, 4, 0, 0]} />
      </BarChart>
    );
  }
  if (moduleId === "a2ui-pie") {
    return (
      <PieChart>
        <Pie
          data={[...MAY_2026_BY_VENDOR]}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={70}
          label={({ name, percent }) =>
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {[...MAY_2026_BY_VENDOR].map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
  if (moduleId === "a2ui-line") {
    return (
      <LineChart data={[...MONTHLY_SPEND_2026]}>
        <CartesianGrid stroke="#eceef2" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#111318"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    );
  }
  if (moduleId === "a2ui-stacked") {
    return (
      <BarChart
        data={TEAM_SPEND_BY_MONTH.rows.map((row) => ({
          label: row.label,
          ...row.segments,
        }))}
      >
        <CartesianGrid stroke="#eceef2" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        {TEAM_SPEND_BY_MONTH.series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stackId="a"
            fill={STACK_COLORS[i % STACK_COLORS.length]}
          />
        ))}
      </BarChart>
    );
  }
  return <BarChart data={[]} />;
}

export function StaticChartPreview({ moduleId }: { moduleId: string }) {
  const show =
    moduleId.startsWith("a2ui-") &&
    moduleId !== "a2ui-dashboard" &&
    moduleId !== "a2ui-pipeline";

  if (!show) {
    return (
      <p className="mt-4 text-xs text-[var(--muted)]">
        Reference preview is chart-specific; run the prompt in chat to see the
        live A2UI or sandbox surface.
      </p>
    );
  }

  return (
    <div className="mt-4 h-[200px] rounded-xl border border-[var(--line)] bg-[var(--chip)] p-2">
      <p className="mb-1 px-1 text-[10px] uppercase tracking-wide text-[var(--muted)]">
        Reference (static)
      </p>
      <ResponsiveContainer width="100%" height="85%">
        {renderPreviewChart(moduleId)}
      </ResponsiveContainer>
    </div>
  );
}
