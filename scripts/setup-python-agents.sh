#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

setup_agent() {
  local dir="$1"
  cd "$ROOT/$dir"
  if command -v uv >/dev/null 2>&1; then
    uv sync
    return
  fi
  PY="${PYTHON:-python3.12}"
  if ! command -v "$PY" >/dev/null 2>&1; then
    PY=python3
  fi
  "$PY" -m venv .venv
  # shellcheck disable=SC1091
  source .venv/bin/activate
  pip install -U pip
  pip install -r requirements.txt
}

setup_agent "agents/langgraph"
setup_agent "agents/agno"
