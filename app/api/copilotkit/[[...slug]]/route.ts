import {
  BuiltInAgent,
  CopilotRuntime,
  createCopilotRuntimeHandler,
  InMemoryAgentRunner,
} from "@copilotkit/runtime/v2";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";
import { AuditMiddleware, PolicyMiddleware } from "../../../../middleware/studio-middleware";
import { analyticsPrompt, documentsPrompt } from "../../../../lib/prompts";
import { resolveLlmConfig } from "../../../../lib/llm-config";

const { model, apiKey } = resolveLlmConfig();

const langgraphUrl = process.env.LANGGRAPH_DEPLOYMENT_URL;
const langgraphDeployment =
  langgraphUrl === "builtin" ? undefined : (langgraphUrl ?? "http://localhost:8123");
const langsmithApiKey = process.env.LANGSMITH_API_KEY ?? "";

function resolveAgent(
  graphId: "analytics" | "documents",
  builtIn: BuiltInAgent,
): BuiltInAgent | LangGraphAgent {
  if (langgraphUrl === "builtin") {
    return builtIn;
  }
  return new LangGraphAgent({
    deploymentUrl: langgraphDeployment!,
    graphId,
    langsmithApiKey,
    assistantConfig: { recursion_limit: 100 },
  });
}

const analyticsBuiltIn = new BuiltInAgent({
  model,
  apiKey,
  prompt: analyticsPrompt,
  maxSteps: 10,
});
analyticsBuiltIn.use(new PolicyMiddleware(), new AuditMiddleware("analytics"));

const documentsBuiltIn = new BuiltInAgent({
  model,
  apiKey,
  prompt: documentsPrompt,
  maxSteps: 10,
});
documentsBuiltIn.use(new PolicyMiddleware(), new AuditMiddleware("documents"));

const analyticsAgent = resolveAgent("analytics", analyticsBuiltIn);
const documentsAgent = resolveAgent("documents", documentsBuiltIn);

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
