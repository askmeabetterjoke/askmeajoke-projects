# Production hosting (Vercel + LangGraph)

Vercel runs the **Next.js app** and `/api/copilotkit`. Both chat agents are **LangGraph-backed** (or **built-in** on Vercel):

| Agent id | Graph | Role |
| --- | --- | --- |
| `analytics` | `analytics` | Finance dashboards, charts, charge HITL |
| `documents` | `documents` | Invoice extract, canvas, expense HITL |

Same CopilotKit UI; `ChatPanel` switches agent by tab.

## Quick matrix

| Mode | Vercel env | What runs |
| --- | --- | --- |
| **Built-in (simplest)** | `LANGGRAPH_DEPLOYMENT_URL=builtin`, `OPENAI_API_KEY` | Both agents as `BuiltInAgent` inside Next.js |
| **LangSmith Cloud** | `LANGGRAPH_DEPLOYMENT_URL=https://…`, `LANGSMITH_API_KEY` | Both graphs on one deployment URL |

No separate Agno host is required for the default demo.

---

## LangGraph Cloud (both graphs)

1. Deploy `agents/langgraph/` — `langgraph.json` registers **`analytics`** and **`documents`**.
2. [LangSmith Deployments](https://docs.langchain.com/langsmith/deploy-to-cloud) or `langgraph deploy`.
3. Set **`OPENAI_API_KEY`** on the LangGraph deployment.
4. Vercel:

```bash
LANGGRAPH_DEPLOYMENT_URL=https://<deployment-url>
LANGSMITH_API_KEY=lsv2_...
OPENAI_API_KEY=sk-...   # optional if only using remote graphs
```

CopilotKit uses `LangGraphAgent` with `graphId: "analytics"` or `"documents"` against the **same** `deploymentUrl`.

---

## Built-in on Vercel (current production shortcut)

```bash
OPENAI_API_KEY=sk-...
LANGGRAPH_DEPLOYMENT_URL=builtin
COPILOTKIT_MODEL=openai/gpt-5-mini   # optional
```

Redeploy after changing env vars. **Documents tab works** without `AGENT_URL`.

---

## Legacy Agno (optional)

`agents/agno/` is kept for reference. It is **not** wired in `route.ts` anymore. To experiment with Agno AgentOS, you would need to restore `HttpAgent` + `AGENT_URL` yourself.

---

## Verify

1. Local: `pnpm dev` → LangGraph **8123** serves both graphs.
2. Production: Network tab → `/api/copilotkit` on analytics vs documents messages.
3. Smoke: `pnpm smoke`
