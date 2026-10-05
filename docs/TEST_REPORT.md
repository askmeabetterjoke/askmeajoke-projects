# AskMeAJoke Projects — test report

**Date:** 2026-10-05  
**Production URL:** https://agui-studio.vercel.app  
**Runtime:** `LANGGRAPH_DEPLOYMENT_URL=builtin` (both agents on Vercel)

## Executive summary

| Verdict | Detail |
|--------|--------|
| **Shareable?** | **Yes** — for peers, recruiters, and conference walkthroughs with the guidance below |
| **Strongest path** | **Dry demo** (`/?demo=dry`) + exploring the finance/documents canvas (no API cost) |
| **Live chat** | **Analytics agent** verified; **documents agent** verified for simple chat; **PDF / `extract_invoice` live** needs a quick re-check before you promise steps 8–10 |

---

## Production automated (2026-10-05)

| Check | Command | Result |
|-------|---------|--------|
| HTTP + runtime wiring | `pnpm smoke:prod` | **Pass** — `/`, redirects, demo PDFs, `/api/copilotkit/info` lists `analytics` + `documents`, A2UI on |
| Demo panel (no LLM) | `CI=1 STUDIO_URL=https://agui-studio.vercel.app npx playwright test e2e/demo-panel.spec.ts` | **3/3 pass** — Demo opens, dry step 1, preflight dry steps 1–2 (Charges tab + filters) |

---

## Production manual / browser (2026-10-05)

| Area | Result | Notes |
|------|--------|--------|
| Home loads, branding | Pass | “AskMeAJoke Projects”, Northwind canvas |
| Legacy routes | Pass | `/analytics`, `/catalog`, etc. redirect to `/` |
| Demo panel dry preflight 1–2 | Pass | ✓ Agent context, ✓ Frontend tools, Charges “Top 10 / Most expensive” |
| **Analytics live chat** | Pass | “Reply PONG” → **PONG** (~few seconds) |
| Documents tab UI | Pass | Inbox queue, extraction panel, INV-5501 in list |
| **Documents live chat (no tools)** | Pass | “Reply PONG” → **PONG** |
| **Documents live + `extract_invoice`** | **Fail / hung** | “Use extract_invoice for INV-5501…” stayed **Thinking…** >2 min (no error surfaced) |
| Full 12-step live demo | Not run | Steps 3–12 need LLM + HITL; run yourself before a high-stakes demo |

---

## Local automated (reference)

```bash
pnpm smoke              # Next 3100 + LangGraph 8123
pnpm test:e2e           # Playwright dry demo
pnpm preflight          # smoke + e2e + checklist
pnpm smoke:prod         # production wiring only
pnpm test:e2e:prod      # Playwright against Vercel
```

**Before a live session (presenter):**

1. `pnpm smoke:prod` and `pnpm test:e2e:prod`
2. Hard refresh https://agui-studio.vercel.app/
3. Demo → uncheck **Dry run** → **Preflight live (steps 1–2)**
4. On **Documents**, run one **extract** message (step 8 script) and confirm it finishes
5. Steps **7–10**: click **Approve** on each HITL card when they appear

**Zero-cost walkthrough for visitors:** https://agui-studio.vercel.app/?demo=dry

---

## Shareability guide

### Safe to share today

- **Link:** https://agui-studio.vercel.app
- **Repo:** https://github.com/askmeabetterjoke/askmeajoke-projects
- **Story:** One UI, two agents (`analytics` vs `documents`), shared finance state, CopilotKit + AG-UI (A2UI, HITL, frontend tools)
- **Visitor instructions:** Open **Demo** → leave **Dry run** on → run **Preflight (dry, steps 1–2)** or click individual steps; switch **Documents** tab to see the second agent context

### Tell people upfront

| Topic | What to say |
|-------|-------------|
| **Data** | Fictional **Northwind Finance** demo; not real company data |
| **Cost** | Live chat uses **your** OpenAI key on Vercel — unlimited public use can incur cost; dry run avoids LLM calls |
| **Auth** | No login; anyone can chat |
| **AI disclaimer** | UI shows “AI can make mistakes…” |
| **Telemetry** | CopilotKit runtime telemetry may be on unless `COPILOTKIT_TELEMETRY_DISABLED=true` on Vercel |
| **Full live demo** | Run steps 8–10 yourself once before promising PDF extract + HITL on production |

### Not recommended to claim yet

- “Full 12-step live demo always works on production” — **documents tool flow** failed once in testing; analytics live path is solid
- “Runs real LangGraph Cloud graphs” — production is **builtin** unless you change env and deploy graphs to LangSmith

---

## Demo features (implemented)

| Feature | Purpose |
|---------|---------|
| **Dry run** | Tab/filter changes only; no `runAgent` |
| **Preflight (steps 1–2)** | One-click smoke or dry UI check |
| **HITL steps 7–10** | Presenter must **Approve** in chat |
| **`?demo=dry` / `?preflight=1`** | Query flags for CI and Playwright |

---

## Known gaps / follow-ups

1. **Investigate** documents agent stuck on **Thinking…** when calling `extract_invoice` on Vercel (client tool round-trip or timeout).
2. Optional: `maxDuration` on `/api/copilotkit` if long tool loops hit serverless limits.
3. TypeScript build still skipped on Vercel (`ignoreBuildErrors`) — does not block the deployed demo.

---

## Prior local report (2026-10-04)

Local stack was Next 3100 + LangGraph 8123 + optional Agno 8000. Production no longer requires Agno for documents.
