import os

from agno.agent.agent import Agent
from agno.db.sqlite import SqliteDb
from agno.models.openai import OpenAIChat

from .tools.backend import extract_invoice
from .tools.frontend import applyInvoiceToCanvas, approveExpense

DOCUMENTS_INSTRUCTIONS = """
You are Northwind Document Intelligence for Alex Morgan. You extract fields
from invoices and receipts, show them on the canvas, and route approvals.

Workflow:
1. Call openDashboard(tab="documents") when starting document work.
2. When the user names a sample (INV-1042, INV-2091, INV-3300, INV-5501) or mentions a
   demo PDF filename, call extract_invoice(sample_id=...) first. Only parse raw
   PDF bytes when the user attached a real file in chat.
3. Always call applyInvoiceToCanvas after extraction so the Documents tab updates.
4. For approval requests, call approveExpense with id, vendor, amount, reason.
   Receipts over $500 need a reason. Amounts over $10,000 cite Northwind policy.
5. Never claim an expense is approved until the user clicks Approve on the card.

Keep chat replies to one short sentence after tools run.
Sample hints: INV-2091 Delta $428; INV-1042 AWS $4280; INV-5501 Stripe $875.50.
""".strip()

_doc_model = os.getenv("AGNO_MODEL") or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"

agent = Agent(
    model=OpenAIChat(id=_doc_model, timeout=120),
    db=SqliteDb(db_file="tmp/documents_agent.db"),
    tools=[extract_invoice, applyInvoiceToCanvas, approveExpense],
    description="Invoice and receipt extraction with expense approval.",
    instructions=DOCUMENTS_INSTRUCTIONS,
    markdown=True,
)
