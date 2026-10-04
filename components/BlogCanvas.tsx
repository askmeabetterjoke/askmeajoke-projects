"use client";

import {
  useAgentContext,
  useConfigureSuggestions,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { useState } from "react";
import { z } from "zod";
import {
  BLOG_SECTIONS,
  CAPABILITIES,
  PIPELINE,
  STUDIO_SURFACES,
  type CapabilityId,
} from "../lib/middleware-story";
import { cn } from "../lib/utils";
import { EventStream } from "./EventStream";
import { HeroBanner } from "./shell/HeroBanner";

const SECTION_IDS = [
  "current-state",
  "stall",
  "ag-ui",
  "copilotkit",
  "spectrum",
  "studio",
  "live",
] as const;

export function BlogCanvas() {
  const [section, setSection] = useState<string>("current-state");
  const [capability, setCapability] = useState<CapabilityId | null>(null);

  useAgentContext({
    description: "PM-facing AG-UI Studio essay",
    value: {
      visibleSection: section,
      highlightedCapability: capability,
      sections: BLOG_SECTIONS.map((s) => s.id),
      capabilities: CAPABILITIES.map((c) => c.id),
    },
  });

  useConfigureSuggestions({
    available: "always",
    suggestions: [
      {
        title: "Start from today",
        message:
          "Scroll to current-state and explain, for a PM, why most copilots are still just chat boxes.",
      },
      {
        title: "What is AG-UI?",
        message:
          "Scroll to the AG-UI section and explain the protocol in product language, then draw an A2UI pipeline diagram.",
      },
      {
        title: "What did we ship?",
        message:
          "Scroll to the studio section and walk through essay and Chat — what a PM can demo tomorrow.",
      },
      {
        title: "A2UI vs sandbox",
        message:
          "Scroll to the generative UI spectrum and contrast catalog charts with Open Generative UI. Demo a small sandbox chart if helpful.",
      },
    ],
  });

  useFrontendTool({
    name: "scrollToSection",
    agentId: "blog",
    description: "Scroll the blog to a named section.",
    parameters: z.object({
      id: z
        .enum(SECTION_IDS)
        .describe("Section id from the PM essay outline"),
    }),
    handler: async ({ id }) => {
      setSection(id);
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return `Scrolled to ${id}`;
    },
  });

  useFrontendTool({
    name: "highlightCapability",
    agentId: "blog",
    description: "Highlight a middleware capability card on the blog.",
    parameters: z.object({
      id: z.enum([
        "transform",
        "filter",
        "policy",
        "auth",
        "observe",
        "recover",
        "a2ui",
        "openGenUi",
        "bridge",
      ]),
    }),
    handler: async ({ id }) => {
      setCapability(id);
      setSection("copilotkit");
      document.getElementById("copilotkit")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return `Highlighted ${id}`;
    },
  });

  return (
    <article className="mx-auto max-w-3xl space-y-12 px-8 py-8">
      <HeroBanner
        kicker="Welcome back"
        title="AG-UI for product"
        subtitle="Where copilots stall today — and the protocol that turns an agent into a product."
        actions={
          <>
            <a
              href="#studio"
              className="inline-flex items-center rounded-full bg-[var(--ink)] px-4 py-2 text-[13px] font-medium text-white"
            >
              + What we shipped
            </a>
            <a
              href="/chat"
              className="inline-flex items-center rounded-full border border-[var(--line-strong)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--ink)]"
            >
              Open Chat
            </a>
          </>
        }
      />

      <section id="current-state" className="space-y-4">
        <Kicker>01 · Current state</Kicker>
        <h2 className="text-xl font-semibold">
          We already shipped “a copilot.” Users still do the work.
        </h2>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          The default AI product in 2025–26 is a sidebar. You paste a question,
          you get a paragraph. Sometimes the model cites a help article.
          Sometimes it hallucinates a button that does not exist. The rest of
          the application — tables, filters, approvals, dashboards — stays
          dumb until a human clicks it.
        </p>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          That shape is easy to roadmap: wrap an LLM, add a chat widget, call
          it intelligence. It looks like progress in a demo. In production it
          fails three PM tests:
        </p>
        <ul className="space-y-2 text-[15px] leading-7 text-[var(--muted)]">
          <li>
            <strong className="font-semibold text-[var(--text-ink)]">
              It cannot operate the product.
            </strong>{" "}
            “Show me May spend” becomes a wall of markdown instead of opening
            Charges, applying a date filter, and highlighting the row.
          </li>
          <li>
            <strong className="font-semibold text-[var(--text-ink)]">
              It cannot be trusted with policy.
            </strong>{" "}
            “Approve the AWS charge” becomes the model saying “done” in text
            while nothing in finance systems moved — or worse, it moved with
            no human in the loop.
          </li>
          <li>
            <strong className="font-semibold text-[var(--text-ink)]">
              It cannot show, only tell.
            </strong>{" "}
            Rankings, mix, and trends belong in charts and cards. A chat
            transcript is a poor dashboard, and a screenshot of a dashboard is
            a poor chat.
          </li>
        </ul>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          Internally we also inherited vendor gravity. Each model lab has its
          own “computer use” or “artifacts” story. If your UX is glued to one
          provider’s widget, swapping models, running on-prem, or putting two
          agents on one canvas becomes a rewrite — not a config change.
        </p>
        <Takeaway>
          Current state: copilots are conversational help, not operators. The
          product still lives in React; the agent lives in a text stream. Those
          two worlds do not share a contract.
        </Takeaway>
      </section>

      <section id="stall" className="space-y-4">
        <Kicker>02 · The stall</Kicker>
        <h2 className="text-xl font-semibold">
          The gap is not “smarter models.” It is a missing product interface.
        </h2>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          PMs keep asking for the same next features: let the agent click
          around the app, let it draw a chart, let a manager approve before
          money moves, let us audit what happened, let us not bet the company
          on one API. Engineering answers with a pile of one-off tools —
          custom JSON blobs, iframe hacks, prompt-only “please output HTML.”
        </p>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          That does not scale. Every new surface is a new handshake: different
          events, different auth, different ways to cancel a run. QA cannot
          replay a session. Legal cannot see where policy was injected. Design
          cannot brand a pie chart that the model invented as raw HTML.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Meaning
            title="What users think they bought"
            body="An assistant that sees the screen, acts with permission, and shows results in the same visual language as the rest of the product."
          />
          <Meaning
            title="What we actually shipped"
            body="A completion API with a text field. Shared state is a coincidence. Approvals are honor-system. Charts are a hope."
          />
        </div>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          The missing piece is not another prompt. It is a{" "}
          <em>wire protocol between agents and user interfaces</em> — the same
          idea as HTTP for the web, or USB for peripherals. Once that exists,
          CopilotKit can be the product SDK on top of it: chat, tools,
          middleware, generative UI.
        </p>
      </section>

      <section id="ag-ui" className="space-y-4">
        <Kicker>03 · The protocol</Kicker>
        <h2 className="text-xl font-semibold">
          AG-UI is the contract: agents emit events, the product reacts.
        </h2>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          <strong className="font-semibold text-[var(--text-ink)]">
            AG-UI
          </strong>{" "}
          (Agent–User Interaction) is an open protocol for that handshake.
          Agents do not “talk to React.” They emit a typed event stream: run
          started and finished, streamed text, tool calls and results, shared
          state, human interrupts, activity (including generative UI). Any
          frontend that understands the stream can render it. Any backend that
          speaks the stream can power it.
        </p>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          For a PM, the protocol is the reason you can say “we are not locked
          to one model vendor’s chat UI.” LangGraph, Google ADK, Mastra, a
          homegrown OpenAI wrapper, CopilotKit’s built-in agent — they become
          interchangeable at the edge of the product as long as they emit
          AG-UI. The canvas, the chat, the approval card, the live log all
          subscribe to the same events.
        </p>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          Middleware sits on that stream. One layer injects spend policy
          before the model runs. Another records every event into an audit
          buffer. Another turns a tool result into a catalog of cards and
          charts. Because this runs in{" "}
          <strong className="font-semibold text-[var(--text-ink)]">
            Copilot Runtime on the server
          </strong>
          , the browser cannot strip policy or steal keys. That is the
          difference between a demo chatbot and something finance will sign
          off on.
        </p>
        <ol className="grid gap-2 sm:grid-cols-3">
          {PIPELINE.map((step, i) => (
            <li
              key={step.id}
              className="rounded-2xl border border-[var(--line)] bg-white p-3"
            >
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm font-semibold">{step.label}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{step.hint}</p>
            </li>
          ))}
        </ol>
        <Takeaway>
          AG-UI is not a chat library. It is the event contract so “the agent”
          and “the product” can share lifecycle, tools, state, and UI without
          a custom integration per model.
        </Takeaway>
      </section>

      <section id="copilotkit" className="space-y-4">
        <Kicker>04 · CopilotKit</Kicker>
        <h2 className="text-xl font-semibold">
          CopilotKit is what we build with: the product layer on AG-UI.
        </h2>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          If AG-UI is the wire, CopilotKit is the kit you ship: React (and
          Angular) chat, a runtime that hosts agents, middleware you can
          stack, frontend tools that drive the real UI, human-in-the-loop
          cards, and several flavors of generative UI. You do not ask the
          model to “please be a product.” You register the surfaces the
          product already has, and the agent is allowed to use them.
        </p>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          That maps cleanly onto roadmap language:
        </p>
        <ul className="space-y-2 text-[15px] leading-7 text-[var(--muted)]">
          <li>
            <strong className="font-semibold text-[var(--text-ink)]">
              Shared context
            </strong>{" "}
            — the agent sees the current tab, filters, and rows. “What’s on my
            screen?” is a product question, not a vision-model parlor trick.
          </li>
          <li>
            <strong className="font-semibold text-[var(--text-ink)]">
              Frontend tools
            </strong>{" "}
            — open a dashboard, filter a table, flag a transaction. The
            copilot operates the app the user is looking at.
          </li>
          <li>
            <strong className="font-semibold text-[var(--text-ink)]">
              Human-in-the-loop
            </strong>{" "}
            — over-limit spend cannot complete until someone clicks Approve.
            Policy is a card, not a paragraph.
          </li>
          <li>
            <strong className="font-semibold text-[var(--text-ink)]">
              Generative UI
            </strong>{" "}
            — when the answer is a chart or an email, the agent renders a
            surface instead of dumping CSV into chat.
          </li>
        </ul>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          Middleware is how those promises stay true under load. Click a card
          to see what this studio already runs on every request:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CAPABILITIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCapability(item.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition",
                capability === item.id
                  ? "border-[var(--ink)] bg-[var(--chip)]"
                  : "border-[var(--line)] bg-white",
              )}
            >
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                {item.detail}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section id="spectrum" className="space-y-4">
        <Kicker>05 · Generative UI</Kicker>
        <h2 className="text-xl font-semibold">
          Not every chart should be invented. Pick a point on the spectrum.
        </h2>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          “Let the AI draw the UI” is three different products. Mixing them up
          is how you get a pie chart request that comes back as a bar chart —
          or a beautiful iframe you cannot brand, test, or accessibly ship.
          CopilotKit treats this as a spectrum. Same runtime, same AG-UI
          events; you choose per feature.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Meaning
            title="Controlled"
            body="You built the React component. The agent only chooses which one and what data. Highest brand and QA bar. Example: the approval card, the email draft, a KPI tile registered as a frontend tool."
          />
          <Meaning
            title="Declarative (A2UI)"
            body="You own a catalog (Metric, DataTable, BarChart, PieChart…). The agent composes layout + data. Creative inside a fence. New chart types require a catalog entry — that is the feature, not a bug."
          />
          <Meaning
            title="Open Generative UI"
            body="The agent streams HTML/CSS/JS into a sandboxed iframe (Chart.js, gauges, one-off visuals). Maximum range, weaker brand/a11y guarantees. Use when the catalog honestly does not have the widget."
          />
        </div>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          A2UI (Agent-to-UI, with CopilotKit as a design partner) is the
          declarative middle. Dynamic schema: a sub-agent designs the tree
          from your catalog. Fixed schema: you author the tree once; the agent
          only fills data. Open Generative UI is a different primitive:{" "}
          <code className="rounded bg-[var(--chip)] px-1.5 py-0.5 text-[13px]">
            generateSandboxedUi
          </code>
          , not a catalog type. MCP Apps sit further out still — UI shipped by
          someone else’s server, also sandboxed.
        </p>
        <Takeaway>
          PM rule of thumb: if you will screenshot it in a board deck, put it
          in the catalog (or a frontend tool). If it is a one-off explainer,
          sandbox is fine. Never promise “any visualization” from A2UI alone.
        </Takeaway>
      </section>

      <section id="studio" className="space-y-4">
        <Kicker>06 · What we implemented</Kicker>
        <h2 className="text-xl font-semibold">
          This studio is a working slice of that stack — three surfaces, one
          runtime.
        </h2>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          We did not build a slide. We built a CopilotKit app on AG-UI with
          multiple agents (essay, LangGraph analytics, Agno documents) behind one runtime.
          Policy and audit middleware wrap every run. A2UI and Open Generative
          UI are both enabled, so we can show the spectrum instead of picking
          a religion.
        </p>
        <div className="grid gap-3">
          {STUDIO_SURFACES.map((surface) => (
            <a
              key={surface.href}
              href={surface.href}
              className="block rounded-2xl border border-[var(--line)] bg-white p-4 transition hover:border-[var(--accent)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                {surface.role}
              </p>
              <p className="mt-1 text-sm font-semibold">{surface.title}</p>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                {surface.body}
              </p>
            </a>
          ))}
        </div>
        <h3 className="pt-2 text-base font-semibold">
          Chat — finance ops and document intake
        </h3>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          One split layout: copilot on the left, Northwind workspace on the
          right. Use dashboard tabs for Overview through Reports (LangGraph
          analytics — HITL charges, email drafts, A2UI charts) or open{" "}
          <strong>Documents</strong> for Agno invoice extract and expense
          approval; approved rows merge into the charges the analytics agent
          charts.
        </p>
        <h3 className="text-base font-semibold">What this is not yet</h3>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          We have not wired MCP Apps, multi-agent handoff, or production
          identity. The ledger is fixture data. The point of the studio is to
          let a PM feel the contract: events, policy, tools, HITL, and
          generative UI on one canvas — then decide which primitives belong in
          the next quarter’s product, not which model demo to copy.
        </p>
        <Takeaway>
          Demo path: read this essay with the copilot → open{" "}
          <a
            href="/chat"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Chat
          </a>{" "}
          — approve AWS in Finance ops, extract INV-2091 in Documents, then
          chart approved spend. That sequence is the product story.
        </Takeaway>
      </section>

      <section id="live" className="space-y-3">
        <Kicker>07 · Observe</Kicker>
        <h2 className="text-xl font-semibold">
          If you cannot see the stream, you do not have a product log.
        </h2>
        <p className="leading-7 text-[15px] text-[var(--muted)]">
          AuditMiddleware writes AG-UI events into a ring buffer on this page.
          Prompt the copilot, then watch RUN_*, TEXT_*, TOOL_CALL_* land in
          order. That is the same stream CopilotKit uses to drive chat, A2UI,
          and the sandbox — the audit trail a PM can stand next to in a
          security review.
        </p>
        <EventStream />
      </section>
    </article>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
      {children}
    </p>
  );
}

function Meaning({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{body}</p>
    </div>
  );
}

function Takeaway({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-[var(--line)] bg-[var(--chip)] px-4 py-3 text-[13px] leading-6 text-[var(--text-ink)]">
      <span className="font-semibold text-[var(--accent)]">PM takeaway. </span>
      {children}
    </p>
  );
}
