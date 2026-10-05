"""LangGraph documents agent (invoice extract + canvas + expense HITL)."""

import os

from copilotkit import CopilotKitMiddleware
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI

from documents_prompt import DOCUMENTS_SYSTEM_PROMPT

load_dotenv()

_model = os.getenv("LANGGRAPH_MODEL") or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"

graph = create_agent(
    model=ChatOpenAI(model=_model),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt=DOCUMENTS_SYSTEM_PROMPT,
)
