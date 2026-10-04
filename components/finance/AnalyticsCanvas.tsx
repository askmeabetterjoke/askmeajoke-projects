"use client";

import { TEAM_BUDGETS, totals } from "../../lib/finance-data";
import { money } from "../../lib/utils";
import { EventStream } from "../EventStream";
import { DocumentsCanvas } from "../documents/DocumentsCanvas";
import { HeroBanner } from "../shell/HeroBanner";
import { useFinance } from "./FinanceProvider";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "cards", label: "Cards" },
  { id: "charges", label: "Charges" },
  { id: "transactions", label: "Transactions" },
  { id: "reports", label: "Reports" },
  { id: "documents", label: "Documents" },
] as const;

export function AnalyticsCanvas() {
  const finance = useFinance();
  const metrics = totals(finance.charges);

  return (
    <div className="min-h-0 flex-1 overflow-auto px-7 py-5">
      <HeroBanner
        kicker="Welcome back"
        title="Northwind Finance"
        subtitle="Spend, cards, and policy — operated from chat."
        actions={
          <>
            <button
              type="button"
              onClick={() => finance.setTab("charges")}
              className="inline-flex items-center rounded-full bg-[var(--ink)] px-4 py-2 text-[13px] font-medium text-white"
            >
              + New charge view
            </button>
            <button
              type="button"
              onClick={() => finance.setTab("reports")}
              className="inline-flex items-center rounded-full border border-[var(--line-strong)] bg-white px-4 py-2 text-[13px] font-medium"
            >
              Reports
            </button>
          </>
        }
      />
      <div className="mt-5 mb-6 flex items-center justify-between gap-3">
        <div className="flex gap-1 text-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => finance.setTab(tab.id)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                finance.tab === tab.id
                  ? "bg-[var(--ink)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--chip)] hover:text-[var(--ink)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="rounded-xl border border-[var(--line)] px-3 py-1.5 text-[12px] text-[var(--muted)]">
          Q3 2026
        </span>
      </div>

      {finance.tab === "overview" && <Overview metrics={metrics} />}
      {finance.tab === "cards" && <Cards />}
      {finance.tab === "charges" && <Charges />}
      {finance.tab === "transactions" && <Transactions />}
      {finance.tab === "reports" && <Reports />}
      {finance.tab === "documents" && (
        <div className="-mx-2 min-h-[420px]">
          <DocumentsCanvas />
        </div>
      )}
    </div>
  );
}

function Overview({
  metrics,
}: {
  metrics: ReturnType<typeof totals>;
}) {
  const finance = useFinance();
  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          <TargetCard
            kicker="Spend"
            title="Expenses"
            value={money(metrics.spend)}
            hint={`${metrics.spendLimitUsed}% of ${money(metrics.spendLimit)}`}
            kind="line"
          />
          <TargetCard
            kicker="Treasury"
            title="Balance"
            value={money(metrics.balance)}
            hint={`Income ${money(metrics.income)}`}
            kind="bars"
          />
        </div>
        <div className="rounded-[24px] border border-[var(--line)] bg-white p-5">
          <p className="text-sm font-semibold">Life of the ledger</p>
          <ul className="mt-3 space-y-3">
            {[
              {
                label: "Approved",
                grade: String(
                  finance.charges.filter((c) => c.status === "Approved").length,
                ),
              },
              {
                label: "Pending",
                grade: String(
                  finance.charges.filter((c) => c.status === "Pending").length,
                ),
              },
              {
                label: "Over-limit",
                grade: String(metrics.overLimit),
              },
              { label: "Charges", grade: String(metrics.count) },
            ].map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between rounded-2xl bg-[var(--chip)] px-3 py-2.5"
              >
                <span className="text-[13px] font-medium">{row.label}</span>
                <span className="text-[13px] text-[var(--muted)]">{row.grade}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Balance" value={money(metrics.balance)} />
        <Stat label="Income" value={money(metrics.income)} />
        <Stat label="Expenses" value={money(metrics.spend)} />
        <Stat
          label="Spend limit used"
          value={`${metrics.spendLimitUsed}%`}
          hint={`of ${money(metrics.spendLimit)}`}
        />
      </div>
      <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">All Transactions</h2>
          <button
            type="button"
            className="text-sm text-[var(--accent)]"
            onClick={() => finance.setTab("transactions")}
          >
            View ledger
          </button>
        </div>
        <ul className="divide-y divide-[var(--line)]">
          {finance.ledger.map((row) => (
            <li key={row.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{row.merchant}</p>
                <p className="text-xs text-[var(--muted)]">
                  {row.kind} · {row.date}
                  {row.flagged ? " · flagged" : ""}
                </p>
                {row.note ? (
                  <p className="mt-1 text-xs text-[var(--accent)]">{row.note}</p>
                ) : null}
              </div>
              <p className="text-sm font-semibold text-rose-600">
                {money(row.amount)}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {TEAM_BUDGETS.map((team) => (
          <div
            key={team.team}
            className="rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] p-4 shadow-sm"
          >
            <p className="text-sm font-medium">{team.team}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {team.pending} pending / {money(team.limit)}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--bg)]">
              <div
                className="h-full bg-[var(--accent)]"
                style={{ width: `${(team.pending / team.limit) * 100 + 8}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cards() {
  const { cards } = useFinance();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Credit Cards</h2>
        <button
          type="button"
          className="rounded-full border border-[var(--ink)] bg-[var(--ink)] px-3 py-1.5 text-sm font-medium text-white"
        >
          Add New Card
        </button>
      </div>
      <p className="mb-5 text-sm text-[var(--muted)]">
        Manage cards and spending policies for your team.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`plastic-card ${card.color} relative overflow-hidden rounded-3xl p-5 shadow-sm`}
          >
            <div className="flex items-start justify-between text-xs uppercase tracking-wider text-white/80">
              <span className="grid h-8 w-10 place-items-center rounded-md bg-white/20 text-[10px]">
                chip
              </span>
              <span>{card.brand}</span>
            </div>
            <p className="mt-10 text-xl tracking-[0.3em]">•••• {card.last4}</p>
            <div className="mt-6 flex justify-between text-[10px] uppercase tracking-wider text-white/80">
              <span>
                Card holder
                <br />
                <span className="text-xs tracking-normal text-white">
                  {card.holder}
                </span>
              </span>
              <span>
                Valid thru
                <br />
                <span className="text-xs tracking-normal text-white">
                  {card.validThru}
                </span>
              </span>
            </div>
            <div className="mt-5 rounded-xl bg-white p-3 text-[var(--ink)]">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted)]">Credit limit</span>
                <span className="font-semibold">{money(card.creditLimit)}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-[var(--bg)]">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{
                    width: `${(card.available / card.creditLimit) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-[var(--muted)]">Available</span>
                <span className="font-semibold text-emerald-600">
                  {money(card.available)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Charges() {
  const finance = useFinance();
  const shown = finance.visibleCharges;
  const sum = shown.reduce((s, c) => s + c.amount, 0);
  return (
    <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold">Charges</h2>
          <p className="text-xs text-[var(--text-muted)]">
            {shown.length} of {finance.charges.length} charges · {money(sum)}{" "}
            shown
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            className="rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-2 py-1 font-medium text-[var(--text-ink)]"
            value={finance.filter.sort}
            onChange={(e) =>
              finance.setFilter({
                sort: e.target.value as "most-expensive" | "newest",
              })
            }
          >
            <option value="most-expensive">Most expensive</option>
            <option value="newest">Newest</option>
          </select>
          <select
            className="rounded-full border border-[var(--line-strong)] bg-[var(--surface)] px-2 py-1 font-medium text-[var(--text-ink)]"
            value={finance.filter.show}
            onChange={(e) =>
              finance.setFilter({ show: e.target.value as "all" | "top10" })
            }
          >
            <option value="all">All</option>
            <option value="top10">Top 10</option>
          </select>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-1">
        {(["all", "Approved", "Pending", "Flagged", "Over-Limit"] as const).map(
          (status) => (
            <button
              key={status}
              type="button"
              onClick={() => finance.setFilter({ status })}
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                finance.filter.status === status
                  ? "bg-[var(--ink)] text-white"
                  : "border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--text-ink)] hover:bg-[var(--bg)]"
              }`}
            >
              {status === "all" ? "All statuses" : status}
            </button>
          ),
        )}
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-[var(--muted)]">
          <tr>
            <th className="py-2">Merchant</th>
            <th>Category</th>
            <th>Team</th>
            <th>Date</th>
            <th>Status</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((row) => (
            <tr
              key={row.id}
              className={`border-t border-[var(--line)] ${
                finance.highlightChargeId === row.id
                  ? "bg-[var(--bg)] ring-1 ring-inset ring-[var(--accent-muted)]"
                  : ""
              }`}
            >
              <td className="py-2.5 font-medium">
                {row.merchant}
                {row.note ? (
                  <p className="text-xs font-normal text-[var(--accent)]">
                    {row.note}
                  </p>
                ) : null}
              </td>
              <td className="text-[var(--muted)]">{row.category}</td>
              <td>{row.team}</td>
              <td>{row.date}</td>
              <td>
                <Status status={row.status} />
              </td>
              <td className="text-right font-semibold">{money(row.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Transactions() {
  const finance = useFinance();
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">Transactions</h2>
      <ul className="divide-y divide-[var(--line)]">
        {finance.ledger.map((row) => (
          <li key={row.id} className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{row.merchant}</p>
                <p className="text-xs text-[var(--muted)]">
                  {row.kind} · {row.date}
                </p>
              </div>
              <p className="font-semibold text-rose-600">{money(row.amount)}</p>
            </div>
            {row.note ? (
              <p className="mt-2 rounded-lg bg-[var(--bg)] px-3 py-2 text-xs text-[var(--muted)]">
                {row.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Reports() {
  const finance = useFinance();
  const byTeam = Object.entries(
    finance.charges.reduce<Record<string, number>>((acc, row) => {
      acc[row.team] = (acc[row.team] ?? 0) + row.amount;
      return acc;
    }, {}),
  );
  const max = Math.max(...byTeam.map(([, v]) => v), 1);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Spend by team</h2>
        <div className="space-y-3">
          {byTeam.map(([team, value]) => (
            <div key={team}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{team}</span>
                <span className="font-medium">{money(value)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--bg)]">
                <div
                  className="h-full bg-[var(--accent)]"
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">Policy reminders</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          <li>Charges over $10,000 require human approval (PolicyMiddleware).</li>
          <li>Over-limit cloud and ads spend should be flagged before close.</li>
          <li>Unrecognized merchants go to review with a note on the ledger.</li>
        </ul>
      </div>
      <EventStream />
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
      <p className="text-xs font-medium text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="text-xs text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  );
}

function TargetCard({
  kicker,
  title,
  value,
  hint,
  kind,
}: {
  kicker: string;
  title: string;
  value: string;
  hint: string;
  kind: "line" | "bars";
}) {
  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-white p-5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
        {kicker}
      </p>
      <p className="mt-1 text-sm font-semibold">{title}</p>
      <p className="mt-3 text-[28px] font-semibold tracking-tight">{value}</p>
      <p className="text-[12px] text-[var(--muted)]">{hint}</p>
      <svg viewBox="0 0 220 64" className="mt-4 h-16 w-full text-[var(--ink)]">
        {kind === "line" ? (
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            points="0,48 20,44 40,46 60,30 80,34 100,22 120,26 140,18 160,24 180,14 200,20 220,10"
          />
        ) : (
          Array.from({ length: 18 }).map((_, i) => (
            <rect
              key={i}
              x={i * 12}
              y={12 + (i % 5) * 6}
              width="7"
              height={52 - (i % 5) * 6}
              rx="1"
              fill="currentColor"
              opacity={0.18 + (i % 4) * 0.12}
            />
          ))
        )}
      </svg>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const map: Record<string, string> = {
    Approved: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Flagged: "bg-orange-50 text-orange-700",
    "Over-Limit": "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${map[status]}`}>
      {status}
    </span>
  );
}
