/** Load a tiny demo PDF from /public/demo-pdfs for presenter runs (no chat clutter). */
export async function loadDemoPdfBase64(fileName: string): Promise<string> {
  const res = await fetch(`/demo-pdfs/${encodeURIComponent(fileName)}`);
  if (!res.ok) {
    throw new Error(`Demo PDF not found: ${fileName}`);
  }
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

export type DemoUserContent =
  | string
  | Array<
      | { type: "text"; text: string }
      | {
          type: "document";
          source: {
            type: "data";
            value: string;
            mimeType: string;
            metadata?: { filename?: string };
          };
        }
    >;

export type BuildDemoUserContentOptions = {
  /** When false (default), simulates upload in text — avoids multimodal token bloat. */
  attachBinary?: boolean;
};

export async function buildDemoUserContent(
  prompt: string,
  pdfFileName?: string,
  options?: BuildDemoUserContentOptions,
): Promise<DemoUserContent> {
  if (!pdfFileName) return prompt;

  if (!options?.attachBinary) {
    return `${prompt}\n\n[Demo file: ${pdfFileName} — use extract_invoice with the sample id from this message; do not require PDF bytes.]`;
  }

  const value = await loadDemoPdfBase64(pdfFileName);
  return [
    { type: "text", text: prompt },
    {
      type: "document",
      source: {
        type: "data",
        value,
        mimeType: "application/pdf",
        metadata: { filename: pdfFileName },
      },
    },
  ];
}
