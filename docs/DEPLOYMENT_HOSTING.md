# Hosted LangGraph & Agno for production (Vercel + APIs)

Vercel only runs the **Next.js app** and `/api/copilotkit`. Analytics and documents agents must be reachable over **HTTPS** from Vercel’s serverless functions.

## Quick matrix

| Piece | Hosted option? | What you put in Vercel |
| --- | --- | --- |
| **Analytics (LangGraph)** | Yes — **LangSmith / LangGraph Cloud** | `LANGGRAPH_DEPLOYMENT_URL` = deployment API URL, `LANGSMITH_API_KEY` |
| **Analytics (no LangGraph host)** | Yes — **built-in agent on Vercel** | `LANGGRAPH_DEPLOYMENT_URL=builtin`, `OPENAI_API_KEY` |
| **Documents (Agno)** | **Partial** — you host **AgentOS**; **os.agno.com** is control plane, not the chat HTTP API | `AGENT_URL` = public base URL of your AgentOS (e.g. Railway/Fly/AWS) |

---

## LangGraph (hosted)

LangChain’s **LangSmith Deployments** (LangGraph Cloud) give you a managed agent server with an HTTPS **deployment URL**.

1. Deploy the graph in `agents/langgraph/` (`graphId`: **`analytics`** in `langgraph.json`).
2. Options:
   - **UI:** [LangSmith](https://smith.langchain.com) → **Deployments** → New deployment (GitHub or connected repo).
   - **CLI:** `langgraph deploy` from the langgraph folder (see [deployment quickstart](https://docs.langchain.com/langsmith/deployment-quickstart)).
3. In the deployment details, copy the **API / deployment URL**.
4. On **LangGraph deployment env** (LangSmith UI), set **`OPENAI_API_KEY`** (and any model vars) so the graph can call the model.
5. On **Vercel**:

```bash
LANGGRAPH_DEPLOYMENT_URL=https://<your-deployment-url>   # no trailing slash
LANGSMITH_API_KEY=lsv2_...
OPENAI_API_KEY=sk-...   # still needed if you use builtin fallback or other routes
```

CopilotKit wires this in `app/api/copilotkit/[[...slug]]/route.ts` via `LangGraphAgent({ deploymentUrl, graphId: "analytics", langsmithApiKey })`.

**Docs:** [Deploy to LangSmith Cloud](https://docs.langchain.com/langsmith/deploy-to-cloud), [LangGraph deploy overview](https://docs.langchain.com/oss/python/langgraph/deploy).

---

## Agno (hosted AgentOS — not a single “Agno API” URL)

Agno does **not** replace your runtime with a generic multi-tenant HTTP API like “paste one URL and all agents work.” You run **AgentOS** (this repo: `agents/agno/main.py` → AG-UI at **`/documents/agui`**).

| Product | Role |
| --- | --- |
| **[os.agno.com](https://os.agno.com)** | Control plane: connect, monitor, sessions — **browser talks to your OS URL** |
| **Your deployed AgentOS** | The **API** CopilotKit must call: `{AGENT_URL}/documents/agui` |

**Deploy AgentOS** using Agno templates (pick one):

- [Railway](https://docs.agno.com/deploy/templates/railway/deploy)
- [AWS ECS](https://docs.agno.com/deploy/templates/aws/deploy)
- [Fly.io, GCP Cloud Run, Azure, Kubernetes, Docker](https://docs.agno.com/deploy/introduction)

After deploy you get something like `https://your-service.example.com`. Then:

1. **Vercel:**

```bash
AGENT_URL=https://your-service.example.com
```

2. **AgentOS env** (on Railway/AWS/etc.): `OPENAI_API_KEY`, optional `AGNO_MODEL=gpt-4o-mini`.

3. **Production auth:** Agno recommends **JWT** between control plane and live OS; for CopilotKit `HttpAgent` you may need to align auth headers (see Agno “Connect OS → Live” + JWT public key in deployment env). Local dev often runs without JWT.

4. Register the live OS in **os.agno.com** → **Connect OS → Live** with the same public URL (for ops, not for Vercel).

---

## Minimal production paths

### A. Fastest: analytics only on Vercel

```bash
OPENAI_API_KEY=sk-...
LANGGRAPH_DEPLOYMENT_URL=builtin
```

Documents tab still needs **`AGENT_URL`** pointing at hosted AgentOS.

### B. Full demo (analytics + documents)

```bash
OPENAI_API_KEY=sk-...
LANGGRAPH_DEPLOYMENT_URL=https://<langsmith-deployment-url>
LANGSMITH_API_KEY=lsv2_...
AGENT_URL=https://<your-agentos-host>
```

Redeploy Vercel after changing environment variables.

---

## Verify

1. Vercel → Project → **Settings → Environment Variables** (Production).
2. Redeploy.
3. Browser **Network** → send a chat message → **`/api/copilotkit`** should not show connection errors to `localhost`.
4. LangSmith deployment: run a test from deployment UI.
5. Agno: `curl -sI "$AGENT_URL/health"` or open docs path your template exposes.

---

## References

- LangGraph Cloud: https://docs.langchain.com/langsmith/deploy-to-cloud  
- Agno deploy templates: https://docs.agno.com/deploy/introduction  
- Connect AgentOS to control plane: https://docs.agno.com/agent-os/connect-your-os  
- This app’s runtime: `app/api/copilotkit/[[...slug]]/route.ts`, `.env.example`
