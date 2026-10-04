"use client";

import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CatalogRenderers } from "@copilotkit/a2ui-renderer";
import { EmailDraftCard } from "../components/EmailDraftCard";
import type { StudioDefinitions } from "./definitions";

const ink = "#111318";
const muted = "#8a8f98";
const line = "#eceef2";
const chartColors = ["#111318", "#4b5563", "#9ca3af", "#d1d5db", "#6b7280"];

export const studioRenderers: CatalogRenderers<StudioDefinitions> = {
  Row: ({ props, children }) => {
    const items = Array.isArray(props.children) ? props.children : [];
    return (
      <div
        style={{
          display: "flex",
          gap: `${props.gap ?? 12}px`,
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {items.map((id, i) => (
          <div key={`${id}-${i}`} style={{ flex: "1 1 140px", minWidth: 0 }}>
            {children(id)}
          </div>
        ))}
      </div>
    );
  },
  Column: ({ props, children }) => {
    const items = Array.isArray(props.children) ? props.children : [];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${props.gap ?? 10}px`,
          width: "100%",
        }}
      >
        {items.map((id, i) => (
          <React.Fragment key={`${id}-${i}`}>{children(id)}</React.Fragment>
        ))}
      </div>
    );
  },
  Text: ({ props }) => (
    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: ink }}>
      {props.text}
    </p>
  ),
  Card: ({ props, children }) => (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${line}`,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 13, color: ink }}>
        {props.title}
      </div>
      {props.subtitle ? (
        <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
          {props.subtitle}
        </div>
      ) : null}
      {props.child ? (
        <div style={{ marginTop: 10 }}>{children(props.child)}</div>
      ) : null}
    </div>
  ),
  Metric: ({ props }) => (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${line}`,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: muted,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {props.label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 650, color: ink, marginTop: 4 }}>
        {props.value}
      </div>
      {props.trendValue ? (
        <div
          style={{
            fontSize: 12,
            marginTop: 4,
            color:
              props.trend === "down"
                ? "#c2410c"
                : props.trend === "up"
                  ? "#0f766e"
                  : muted,
          }}
        >
          {props.trendValue}
        </div>
      ) : null}
    </div>
  ),
  StatusBadge: ({ props }) => {
    const variant = props.variant ?? "info";
    const colors: Record<string, { bg: string; fg: string }> = {
      success: { bg: "#ecfdf5", fg: "#047857" },
      warning: { bg: "#fff7ed", fg: "#c2410c" },
      error: { bg: "#fef2f2", fg: "#b91c1c" },
      info: { bg: "#eef2ff", fg: "#4338ca" },
    };
    const c = colors[variant];
    return (
      <span
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          borderRadius: 999,
          padding: "2px 8px",
          fontSize: 11,
          fontWeight: 600,
          background: c.bg,
          color: c.fg,
        }}
      >
        {props.text}
      </span>
    );
  },
  DataTable: ({ props }) => (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            {props.columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: "left",
                  color: muted,
                  fontWeight: 600,
                  padding: "6px 8px",
                  borderBottom: `1px solid ${line}`,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row, i) => (
            <tr key={i}>
              {props.columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    padding: "7px 8px",
                    borderBottom: `1px solid ${line}`,
                    color: ink,
                  }}
                >
                  {row[col.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  PipelineStep: ({ props }) => {
    const tint: Record<string, string> = {
      input: "#eef2ff",
      middleware: "#f5f3ff",
      agent: "#ecfeff",
      ui: "#fdf4ff",
    };
    return (
      <div
        style={{
          background: tint[props.kind] ?? "#fff",
          border: `1px solid ${line}`,
          borderRadius: 12,
          padding: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: muted,
          }}
        >
          {props.kind}
        </div>
        <div style={{ fontWeight: 650, fontSize: 13, color: ink, marginTop: 4 }}>
          {props.title}
        </div>
        <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{props.hint}</div>
      </div>
    );
  },
  CapabilityCard: ({ props }) => (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${line}`,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div style={{ fontWeight: 650, fontSize: 13, color: ink }}>{props.title}</div>
      <div style={{ fontSize: 12, color: muted, marginTop: 6, lineHeight: 1.5 }}>
        {props.detail}
      </div>
    </div>
  ),
  BarChart: ({ props }) => (
    <ChartShell title={props.title} description={props.description} height={220}>
      <ResponsiveContainer width="100%" height={160}>
        <RechartsBarChart data={props.data}>
          <CartesianGrid stroke={line} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#111318" radius={[6, 6, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartShell>
  ),
  PieChart: ({ props }) => (
    <ChartShell title={props.title} description={props.description} height={240}>
      <ResponsiveContainer width="100%" height={170}>
        <RechartsPieChart>
          <Pie
            data={props.data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={64}
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >
            {props.data.map((_, i) => (
              <Cell key={i} fill={chartColors[i % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartShell>
  ),
  LineChart: ({ props }) => (
    <ChartShell title={props.title} description={props.description} height={220}>
      <ResponsiveContainer width="100%" height={160}>
        <RechartsLineChart data={props.data}>
          <CartesianGrid stroke={line} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#111318"
            strokeWidth={2}
            dot={{ r: 3, fill: "#111318" }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartShell>
  ),
  StackedBarChart: ({ props }) => {
    const chartData = props.rows.map((row) => ({
      label: row.label,
      ...row.segments,
    }));
    return (
      <ChartShell title={props.title} description={props.description} height={240}>
        <ResponsiveContainer width="100%" height={170}>
          <RechartsBarChart data={chartData}>
            <CartesianGrid stroke={line} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {props.series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                stackId="stack"
                fill={chartColors[i % chartColors.length]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartShell>
    );
  },
  EmailDraft: ({ props }) => (
    <EmailDraftCard
      to={props.to}
      cc={props.cc}
      subject={props.subject}
      body={props.body}
    />
  ),
};

function ChartShell({
  title,
  description,
  height,
  children,
}: {
  title: string;
  description?: string;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${line}`,
        borderRadius: 14,
        padding: 14,
        height,
      }}
    >
      <div style={{ fontWeight: 650, fontSize: 13, color: ink }}>{title}</div>
      {description ? (
        <div style={{ fontSize: 12, color: muted, marginBottom: 8 }}>
          {description}
        </div>
      ) : null}
      {children}
    </div>
  );
}
