export type UiCatalogKind = "a2ui" | "sandbox";

export type UiCatalogEntry = {
  id: string;
  title: string;
  description: string;
  intent: string;
  kind: UiCatalogKind;
  a2ui?: {
    components: string[];
    samplePrompt: string;
  };
  sandbox?: {
    css: string;
    html: string;
    jsFunctions?: string;
    jsExpressions?: string[];
  };
  createdAt: number;
  reuseCount: number;
  contentHash: string;
};

const STORAGE_KEY = "agui-studio-ui-catalog";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readUiCatalog(): UiCatalogEntry[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UiCatalogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeUiCatalog(entries: UiCatalogEntry[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function hashContent(value: string): string {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return String(h);
}

export function titleFromHtml(html: string): string {
  const match = html.match(/<h[1-3][^>]*>([^<]{2,80})/i);
  if (match?.[1]) return match[1].replace(/\s+/g, " ").trim();
  return "Saved generative UI";
}

export function slugId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return `${slug || "ui"}-${Date.now().toString(36)}`;
}

export function catalogSummary(entries: UiCatalogEntry[]) {
  return entries.map((e) => ({
    id: e.id,
    title: e.title,
    intent: e.intent,
    kind: e.kind,
    components: e.a2ui?.components ?? [],
    reuseCount: e.reuseCount,
  }));
}
