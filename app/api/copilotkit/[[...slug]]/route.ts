import { HttpAgent } from "@ag-ui/client";
import {
  BuiltInAgent,
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";
import { AuditMiddleware, PolicyMiddleware } from "../../../../middleware/studio-middleware";
import { analyticsPrompt } from "../../../../lib/prompts";
import { resolveLlmConfig } from "../../../../lib/llm-config";

const { model, apiKey } = resolveLlmConfig();

const analyticsBuiltIn = new BuiltInAgent({
  model,
  apiKey,
  prompt: analyticsPrompt,
  maxSteps: 10,
});
analyticsBuiltIn.use(new PolicyMiddleware(), new AuditMiddleware("analytics"));

const langgraphUrl = process.env.LANGGRAPH_DEPLOYMENT_URL;
const analyticsAgent =
  langgraphUrl === "builtin"
    ? analyticsBuiltIn
    : new LangGraphAgent({
        deploymentUrl: langgraphUrl ?? "http://localhost:8123",
        graphId: "analytics",
        langsmithApiKey: process.env.LANGSMITH_API_KEY ?? "",
        assistantConfig: { recursion_limit: 100 },
      });

const agentBase = (process.env.AGENT_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);
const documentsAgent = new HttpAgent({
  url: `${agentBase}/documents/agui`,
});

const runtime = new CopilotRuntime({
  agents: {
    default: analyticsAgent,
    analytics: analyticsAgent,
    documents: documentsAgent,
  },
  a2ui: { injectA2UITool: true },
  openGenerativeUI: {
    agents: ["analytics"],
  },
  runner: new InMemoryAgentRunner(),
});

const handler = createCopilotRuntimeHandler({
  runtime,
  basePath: "/api/copilotkit",
});

export const GET = handler;
export const POST = handler;
