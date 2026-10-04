from agno.tools import tool


@tool(external_execution=True)
def applyInvoiceToCanvas(
    id: str,
    vendor: str,
    amount: float,
    date: str,
    category: str,
    source: str,
    confidence: float,
    fileName: str = "",
    lineItems: list[dict] | None = None,
):
    """
    Push extracted invoice fields to the Documents canvas on the right.

    Args:
        id: Invoice id (e.g. INV-2091).
        vendor: Vendor name.
        amount: Total amount in USD.
        date: ISO date string.
        category: Spend category.
        source: invoice or receipt.
        confidence: Model confidence 0-1.
        fileName: Original file name if known.
        lineItems: Optional list of {description, amount} dicts.
    """


@tool(external_execution=True)
def approveExpense(
    id: str,
    vendor: str,
    amount: float,
    reason: str,
):
    """
    Human-in-the-loop approval for an expense or invoice. Shows Approve/Deny
    in chat. Required before marking spend as approved.

    Args:
        id: Invoice id.
        vendor: Vendor name.
        amount: Amount in USD.
        reason: Policy justification shown on the approval card.
    """
