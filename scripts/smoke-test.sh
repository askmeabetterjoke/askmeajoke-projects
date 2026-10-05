#!/usr/bin/env bash
# AG-UI Studio smoke test — infrastructure + runtime wiring (no LLM calls).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="${STUDIO_URL:-http://localhost:3100}"
LG="${LANGGRAPH_URL:-http://localhost:8123}"
AGNO="${AGNO_URL:-http://localhost:8000}"

pass=0
fail=0
note() { echo "  • $*"; }
ok() { pass=$((pass + 1)); echo "✓ $*"; }
bad() { fail=$((fail + 1)); echo "✗ $*"; }

echo "=== AG-UI Studio smoke test ==="
echo "UI=$BASE  LangGraph=$LG  (Agno optional legacy: $AGNO)"
echo

code=$(curl -sf -o /dev/null -w "%{http_code}" "$BASE/" || echo "000")
[[ "$code" == "200" ]] && ok "GET / → $code" || bad "GET / → $code"

for path in "/" "/catalog" "/playground"; do
  code=$(curl -sf -o /dev/null -w "%{http_code}" "$BASE$path" || echo "000")
  [[ "$code" == "200" || "$code" == "307" ]] && ok "GET $path → $code" || bad "GET $path → $code"
done

loc=$(curl -sfI "$BASE/analytics" 2>/dev/null | rg -i "^location:" | tr -d '\r' || true)
[[ "$loc" == *"/"* ]] && ok "GET /analytics redirects home" || bad "GET /analytics redirect ($loc)"

if [[ "${PROD_SMOKE:-}" == "1" ]]; then
  note "PROD_SMOKE=1 — skipping local LangGraph /ok (production uses builtin or remote deploy)"
else
  code=$(curl -sf -o /dev/null -w "%{http_code}" "$LG/ok" || echo "000")
  [[ "$code" == "200" ]] && ok "LangGraph /ok → $code" || bad "LangGraph /ok → $code"
fi

code=$(curl -sf -o /dev/null -w "%{http_code}" "$AGNO/docs" || echo "000")
if [[ "$code" == "200" ]]; then
  ok "Agno /docs → $code (optional legacy)"
else
  note "Agno not running ($code) — documents use LangGraph graph documents on $LG"
fi

code=$(curl -sf -o /dev/null -w "%{http_code}" "$BASE/demo-pdfs/delta-receipt-sfo.pdf" || echo "000")
[[ "$code" == "200" ]] && ok "Demo PDF static → $code" || bad "Demo PDF static → $code"

info=$(curl -sf "$BASE/api/copilotkit/info" || echo "{}")
echo "$info" | rg -q '"analytics"' && ok "Runtime info lists analytics agent" || bad "Runtime analytics agent missing"
echo "$info" | rg -q '"documents"' && ok "Runtime info lists documents agent" || bad "Runtime documents agent missing"
echo "$info" | rg -q '"a2uiEnabled":true' && ok "A2UI enabled on runtime" || bad "A2UI not enabled"

if [[ -x "$ROOT/agents/agno/.venv/bin/python" ]]; then
  model=$("$ROOT/agents/agno/.venv/bin/python" -c "from src.documents_agent import agent; print(agent.model.id)" 2>/dev/null || echo "?")
  [[ "$model" == "gpt-4o-mini" ]] && ok "Agno documents model → $model" || note "Agno documents model → $model (expected gpt-4o-mini)"
fi

echo
echo "=== Summary: $pass passed, $fail failed ==="
[[ "$fail" -eq 0 ]]
