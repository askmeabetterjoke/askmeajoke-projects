/**
 * Server-only LLM routing for AG-UI Studio.
 *
 * Set COPILOTKIT_LLM_PROVIDER=opencode to force OpenCode Zen even when
 * OPENAI_API_KEY is present (e.g. OpenAI quota exhausted).
 */
export function resolveLlmConfig() {
  const forceOpenCode =
    process.env.COPILOTKIT_LLM_PROVIDER?.toLowerCase() === "opencode";

  const hasOpenAi = !!process.env.OPENAI_API_KEY?.trim();
  const hasOpenCode = !!process.env.OPENCODE_API_KEY?.trim();

  const useOpenCode = forceOpenCode || (!hasOpenAi && hasOpenCode);

  if (useOpenCode) {
    process.env.OPENAI_BASE_URL ??= process.env.OPENCODE_BASE_URL;
    process.env.OPENAI_API_KEY ??= process.env.OPENCODE_API_KEY;
  }

  const rawModel = useOpenCode
    ? (process.env.OPENCODE_MODEL ?? "qwen3.8-max")
    : (process.env.COPILOTKIT_MODEL ?? "openai/gpt-5-mini");

  const model = rawModel.includes("/") ? rawModel : `openai/${rawModel}`;

  const apiKey = useOpenCode
    ? process.env.OPENCODE_API_KEY
    : process.env.OPENAI_API_KEY;

  if (!apiKey?.trim()) {
    console.warn(
      "[agui-studio] No LLM API key: set OPENAI_API_KEY or OPENCODE_API_KEY in .env",
    );
  } else if (process.env.NODE_ENV === "development") {
    console.info(
      `[agui-studio] LLM provider: ${useOpenCode ? "OpenCode Zen" : "OpenAI"} · model: ${model}`,
    );
  }

  return { model, apiKey, useOpenCode };
}
