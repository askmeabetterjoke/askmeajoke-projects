# AskMeAJoke Projects

Northwind finance workspace: one chat UI, **two LangGraph agents** (`analytics` + `documents`) via CopilotKit and AG-UI.

- **Analytics** — dashboards, filters, charts, charge HITL (`graphId: analytics`)
- **Documents** — invoice extract, canvas, expense HITL (`graphId: documents`)

Legacy **Agno** code under `agents/agno/` is optional; production uses LangGraph or built-in agents on Vercel.

## Run locally

From the CopilotKit monorepo root (after `pnpm install`):

```bash
cp examples/v1/agui-studio/.env.example examples/v1/agui-studio/.env
pnpm --filter @copilotkit-examples/agui-studio setup:agents
pnpm --filter @copilotkit-examples/agui-studio dev
```

Starts Next **3100** + LangGraph **8123** (both graphs). Open [http://localhost:3100/](http://localhost:3100/).

Optional Agno (legacy): `pnpm --filter @copilotkit-examples/agui-studio dev:agno`

## Deploy (Vercel)

Set **Production** env:

| Variable | Typical value |
| --- | --- |
| `OPENAI_API_KEY` | Your key |
| `LANGGRAPH_DEPLOYMENT_URL` | `builtin` **or** LangSmith deployment URL |
| `LANGSMITH_API_KEY` | Required when using LangSmith URL (not for `builtin`) |

With **`builtin`**, both agents run in the Next.js runtime (no separate LangGraph host).  
With **LangSmith**, deploy `agents/langgraph/` — both `analytics` and `documents` graphs must be on the same deployment.

See [docs/DEPLOYMENT_HOSTING.md](docs/DEPLOYMENT_HOSTING.md).
