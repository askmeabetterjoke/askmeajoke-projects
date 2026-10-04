"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  hashContent,
  readUiCatalog,
  slugId,
  titleFromHtml,
  writeUiCatalog,
  type UiCatalogEntry,
} from "../../lib/ui-catalog-store";

type SaveSandboxInput = {
  title?: string;
  description?: string;
  intent?: string;
  css: string;
  html: string;
  jsFunctions?: string;
  jsExpressions?: string[];
};

type SaveA2uiInput = {
  title: string;
  description?: string;
  intent: string;
  components: string[];
  samplePrompt: string;
};

type UiCatalogContextValue = {
  entries: UiCatalogEntry[];
  saveSandbox: (input: SaveSandboxInput) => UiCatalogEntry;
  saveA2ui: (input: SaveA2uiInput) => UiCatalogEntry;
  bumpReuse: (id: string) => void;
  remove: (id: string) => void;
  get: (id: string) => UiCatalogEntry | undefined;
};

const UiCatalogContext = createContext<UiCatalogContextValue | null>(null);

export function UiCatalogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<UiCatalogEntry[]>([]);

  useEffect(() => {
    setEntries(readUiCatalog());
  }, []);

  const persist = useCallback((next: UiCatalogEntry[]) => {
    setEntries(next);
    writeUiCatalog(next);
  }, []);

  const saveSandbox = useCallback(
    (input: SaveSandboxInput) => {
      const html = input.html.trim();
      const css = input.css.trim();
      const contentHash = hashContent(`${css}\n${html}`);
      const existing = entries.find((e) => e.contentHash === contentHash);
      if (existing) return existing;
      const title = input.title?.trim() || titleFromHtml(html);
      const entry: UiCatalogEntry = {
        id: slugId(title),
        title,
        description:
          input.description?.trim() ||
          "Open Generative UI surface saved after first generation.",
        intent: input.intent?.trim() || title,
        kind: "sandbox",
        sandbox: {
          css,
          html,
          jsFunctions: input.jsFunctions,
          jsExpressions: input.jsExpressions,
        },
        createdAt: Date.now(),
        reuseCount: 0,
        contentHash,
      };
      persist([entry, ...entries]);
      return entry;
    },
    [entries, persist],
  );

  const saveA2ui = useCallback(
    (input: SaveA2uiInput) => {
      const contentHash = hashContent(
        `a2ui:${input.components.join(",")}:${input.intent}`,
      );
      const existing = entries.find((e) => e.contentHash === contentHash);
      if (existing) return existing;
      const entry: UiCatalogEntry = {
        id: slugId(input.title),
        title: input.title.trim(),
        description: input.description?.trim() || input.intent,
        intent: input.intent.trim(),
        kind: "a2ui",
        a2ui: {
          components: input.components,
          samplePrompt: input.samplePrompt,
        },
        createdAt: Date.now(),
        reuseCount: 0,
        contentHash,
      };
      persist([entry, ...entries]);
      return entry;
    },
    [entries, persist],
  );

  const bumpReuse = useCallback(
    (id: string) => {
      persist(
        entries.map((e) =>
          e.id === id ? { ...e, reuseCount: e.reuseCount + 1 } : e,
        ),
      );
    },
    [entries, persist],
  );

  const remove = useCallback(
    (id: string) => {
      persist(entries.filter((e) => e.id !== id));
    },
    [entries, persist],
  );

  const get = useCallback(
    (id: string) => entries.find((e) => e.id === id),
    [entries],
  );

  const value = useMemo(
    () => ({ entries, saveSandbox, saveA2ui, bumpReuse, remove, get }),
    [entries, saveSandbox, saveA2ui, bumpReuse, remove, get],
  );

  return (
    <UiCatalogContext.Provider value={value}>
      {children}
    </UiCatalogContext.Provider>
  );
}

export function useUiCatalog() {
  const ctx = useContext(UiCatalogContext);
  if (!ctx) {
    throw new Error("useUiCatalog must be used inside UiCatalogProvider");
  }
  return ctx;
}
