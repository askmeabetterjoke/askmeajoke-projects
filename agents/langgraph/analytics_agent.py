"""LangGraph analytics agent for AG-UI Studio (frontend tools + HITL)."""

import os

from copilotkit import CopilotKitMiddleware
from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

from analytics_prompt import ANALYTICS_SYSTEM_PROMPT

load_dotenv()

_model = os.getenv("LANGGRAPH_MODEL") or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"

graph = create_agent(
    model=ChatOpenAI(model=_model),
    tools=[],
    middleware=[CopilotKitMiddleware()],
    system_prompt=ANALYTICS_SYSTEM_PROMPT,
)
