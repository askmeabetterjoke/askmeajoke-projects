import json

from agno.tools import tool

from src.sample_invoices import SAMPLE_INVOICES


@tool
def extract_invoice(sample_id: str = "", notes: str = "") -> str:
    """
    Return structured invoice fields for a known sample id (INV-1042, INV-2091,
    INV-3300, INV-5501) or echo notes from manual extraction.

    Args:
        sample_id: Demo invoice id such as INV-2091.
        notes: Optional free-text when the model parsed an attachment itself.
    """
    key = (sample_id or "").strip().upper()
    if key in SAMPLE_INVOICES:
        return json.dumps(SAMPLE_INVOICES[key])
    if notes:
        return json.dumps({"parsedFromAttachment": True, "notes": notes})
    return json.dumps(
        {
            "error": "unknown_sample",
            "hint": "Use INV-1042, INV-2091, INV-3300, INV-5501, or parse the attachment.",
        }
    )
