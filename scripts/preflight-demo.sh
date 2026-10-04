#!/usr/bin/env bash
# Before a live demo: infrastructure smoke + Playwright dry-run UI checks.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "=== 1/2 Infrastructure smoke ==="
bash scripts/smoke-test.sh

echo ""
echo "=== 2/2 Playwright (demo panel, dry run — no LLM) ==="
if ! pnpm exec playwright --version >/dev/null 2>&1; then
  echo "Install browsers once: pnpm exec playwright install chromium"
  pnpm exec playwright install chromium
fi
pnpm exec playwright test e2e/demo-panel.spec.ts

echo ""
echo "=== Live presenter checklist ==="
echo "  1. Hard refresh: ${STUDIO_URL:-http://localhost:3100}/"
echo "  2. Demo → uncheck Dry run → click Preflight live (steps 1–2) to verify OpenAI + LangGraph"
echo "  3. Steps 7–10: click Approve on each HITL card before Run next step"
echo "  4. Optional dry walkthrough: /?demo=dry"
