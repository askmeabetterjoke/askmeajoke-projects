# AG-UI Studio — test report

**Date:** 2026-10-04 (updated)  
**Environment:** Local `pnpm dev` (Next 3100, LangGraph 8123, Agno 8000)

## Executive summary

| Area | Result |
|------|--------|
| Infrastructure | **`pnpm smoke`** — 12/12 |
| UI automation (no LLM) | **`pnpm test:e2e`** — Playwright dry-run demo |
| Full preflight | **`pnpm preflight`** — smoke + e2e + live checklist |
| Live demo (LLM) | Manual — use **Preflight live (steps 1–2)** with dry run off |

---

## Automated commands

```bash
pnpm smoke              # HTTP + runtime wiring only
pnpm test:e2e           # Playwright: Demo panel + dry-run steps 1–2
pnpm preflight          # smoke + test:e2e + presenter checklist
```

**Before a live session**

1. Run `pnpm preflight` (stack must be up, or Playwright reuses UI on 3100).
2. Hard refresh `/chat`.
3. Demo → **Preflight live (steps 1–2)** (dry run **unchecked**) to confirm OpenAI + LangGraph.
4. Steps **7–10**: click **Approve** on each HITL card (~30s each).

**Dry walkthrough (no API spend):** `/chat?demo=dry` or enable **Dry run (no LLM)** in the demo panel.

---

## Demo features (implemented)

| Feature | Purpose |
|---------|---------|
| **Dry run** | Tab/filter changes only; marks steps complete without `runAgent` |
| **Preflight (steps 1–2)** | One-click LangGraph smoke or dry UI check |
| **HITL banner + badges** | Steps 7–10 labeled; in-panel reminder to Approve in chat |
| **`?demo=dry` / `?preflight=1`** | Query flags for CI and Playwright |

---

## Prior manual pass (sample)

| Step | Result |
|------|--------|
| 1 Agent context | Pass (live) |
| 2 Frontend tools | Pass (live) |
| 8 PDF AWS | Pass (live + HITL) |

Full 12-step live run remains manual due to HITL and token limits.

---

## Logs / non-blocking

- LangGraph dev `GET /threads/…` 404 — benign in local dev.
- Token limits — mitigated via history trim, compact context, `gpt-4o-mini` on Agno, text-only demo PDFs.
