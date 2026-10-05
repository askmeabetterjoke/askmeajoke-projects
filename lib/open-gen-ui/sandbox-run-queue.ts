import type { OpenGenerativeUIContent } from "@copilotkit/react-core/v2";
import { CHARGE_STATUS_DONUT_FALLBACK } from "./charge-donut-fallback";

export const CHARTJS_CDN =
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js";

export type WebSandboxInstance = {
  run: (code: string | Function) => Promise<unknown>;
  importScript?: (path: string) => Promise<unknown>;
};

export function contentNeedsChartJs(
  content: OpenGenerativeUIContent,
  html?: string,
): boolean {
  const blob = [
    html ?? "",
    content.jsFunctions ?? "",
    ...(content.jsExpressions ?? []),
  ].join("\n");
  return (
    /\bChart\b/.test(blob) ||
    /chart\.js/i.test(blob) ||
    /<canvas\b/i.test(blob)
  );
}

export function canvasDonutFallbackFor(html?: string): string | undefined {
  if (!html || !/<canvas\b/i.test(html)) return undefined;
  return CHARGE_STATUS_DONUT_FALLBACK;
}

export async function runSandboxSnippets(
  sandbox: WebSandboxInstance,
  snippets: string[],
  opts?: { preloadChartJs?: boolean; tailFallback?: string },
): Promise<void> {
  if (opts?.preloadChartJs && sandbox.importScript) {
    try {
      await sandbox.importScript(CHARTJS_CDN);
    } catch (err) {
      console.warn("[StudioOpenGenUI] Chart.js preload failed:", err);
    }
  }
  for (const code of snippets) {
    await sandbox.run(code);
  }
  if (opts?.tailFallback) {
    await sandbox.run(opts.tailFallback);
  }
}
