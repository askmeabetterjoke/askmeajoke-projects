#!/usr/bin/env python3
"""Write a tiny demo invoice PDF under public/demo-pdfs/ (stdlib only)."""
from __future__ import annotations

import argparse
import zlib
from pathlib import Path


def pdf_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_pdf(lines: list[str]) -> bytes:
    y_start = 750
    content_parts = ["BT", "/F1 12 Tf", f"72 {y_start} Td"]
    first = True
    for line in lines:
        if first:
            content_parts.append(f"({pdf_escape(line)}) Tj")
            first = False
        else:
            content_parts.append("0 -16 Td")
            content_parts.append(f"({pdf_escape(line)}) Tj")
    content_parts.append("ET")
    stream = "\n".join(content_parts).encode("latin-1", errors="replace")
    stream_compressed = zlib.compress(stream)

    objects: list[str | bytes] = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        "/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
        f"<< /Length {len(stream)} /Filter /FlateDecode >>\nstream\n".encode()
        + stream_compressed
        + b"\nendstream",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]

    out = b"%PDF-1.4\n"
    offsets = [0]
    for i, obj in enumerate(objects, 1):
        offsets.append(len(out))
        if isinstance(obj, bytes):
            out += f"{i} 0 obj\n".encode() + obj + b"\nendobj\n"
        else:
            out += f"{i} 0 obj\n{obj}\nendobj\n".encode()

    xref_pos = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for off in offsets[1:]:
        out += f"{off:010d} 00000 n \n".encode()
    out += (
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_pos}\n%%EOF\n"
    ).encode()
    return out


STRIPE_INV_5501 = [
    "NORTHWIND FINANCE - VENDOR INVOICE",
    "Invoice ID: INV-5501",
    "Vendor: Stripe, Inc.",
    "Date: 2026-05-22",
    "Amount Due: USD 875.50",
    "",
    "Line items:",
    "  Payment processing fees (May)  825.50",
    "  Radar fraud screening           50.00",
    "",
    "Please remit within 30 days.",
]

PRESETS: dict[str, tuple[str, list[str]]] = {
    "stripe-may-processing.pdf": ("stripe-may-processing.pdf", STRIPE_INV_5501),
}


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "public" / "demo-pdfs"
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--preset",
        default="stripe-may-processing.pdf",
        choices=list(PRESETS.keys()),
    )
    args = parser.parse_args()
    name, lines = PRESETS[args.preset]
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / name
    path.write_bytes(build_pdf(lines))
    print(f"Wrote {path} ({path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
