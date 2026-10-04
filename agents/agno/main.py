"""Agno AgentOS for AG-UI Studio document intelligence."""

from agno.os import AgentOS
from agno.os.interfaces.agui import AGUI
from dotenv import load_dotenv

from src.documents_agent import agent

load_dotenv()

agent_os = AgentOS(
    agents=[agent],
    interfaces=[AGUI(agent=agent, prefix="/documents")],
)
app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(app="main:app", port=8000, reload=True)
