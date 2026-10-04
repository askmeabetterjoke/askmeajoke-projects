# AskMeAJoke Projects

Northwind finance workspace: chat + dashboard with LangGraph **analytics** and Agno **documents** (PDF intake and expense approval).

## Run locally

From the CopilotKit monorepo root (after `pnpm install`):

```bash
cp examples/v1/agui-studio/.env.example examples/v1/agui-studio/.env
pnpm --filter @copilotkit-examples/agui-studio setup:agents
pnpm --filter @copilotkit-examples/agui-studio dev
```

Open [http://localhost:3100/](http://localhost:3100/).

## Deploy (Vercel)

Set **Root Directory** to this folder if deploying from the CopilotKit monorepo, or deploy this directory as its own project with npm `@copilotkit/*` dependencies.

Required env vars (see `.env.example`): `OPENAI_API_KEY`, `LANGGRAPH_DEPLOYMENT_URL` (or `builtin`), `LANGSMITH_API_KEY`, `AGENT_URL` for Agno.

Agents (LangGraph + Agno) must be hosted separately for production; Vercel runs the Next.js app only.
