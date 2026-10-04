# Invoice PDF upload → Agno approval

## Sample invoice

| Field | Value |
| --- | --- |
| File | `public/demo-pdfs/stripe-may-processing.pdf` |
| ID | **INV-5501** |
| Vendor | Stripe, Inc. |
| Amount | **$875.50** (triggers policy reason > $500) |

Regenerate the PDF:

```bash
python3 scripts/generate-invoice-pdf.py
```

Backend seed: `agents/agno/src/sample_invoices.py` (`INV-5501`).

## Manual flow (real upload)

1. `pnpm dev` — Next **3100**, LangGraph **8123**, Agno **8000**.
2. Open [http://localhost:3100/chat](http://localhost:3100/chat).
3. Click **Documents** on the canvas (chat switches to the documents agent).
4. Click **Upload** (header) or **+** in the chat input and choose `stripe-may-processing.pdf`.
5. Send something like:

   ```text
   Extract this invoice, apply it to the canvas, and start expense approval.
   ```

6. When **Approve expense** appears in chat, click **Approve** (run pauses until you do — “external execution” is expected).
7. Open **Charges** — you should see a row with note `Document intake (invoice) · stripe-may-processing.pdf` and an `inv-` charge id.

## Without attaching bytes (demo / token-safe)

Same steps, but skip file attach and send:

```text
I uploaded stripe-may-processing.pdf. extract_invoice INV-5501, applyInvoiceToCanvas, then approveExpense with reason "May payment processing over $500 policy review."
```

Agno resolves fields via `extract_invoice(sample_id="INV-5501")`.

## Verified (2026-10-04)

- Documents queue showed **Stripe · INV-5501 · $875.50**.
- Canvas extraction panel updated.
- After **Approve**, Charges total included the new document-approved row (`stripe-may-processing.pdf`).
