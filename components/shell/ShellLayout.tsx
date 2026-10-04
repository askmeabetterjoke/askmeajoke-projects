"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "agui-studio-sidebar";

type ShellLayoutState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const ShellLayoutContext = createContext<ShellLayoutState | null>(null);

function readStored(): boolean | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "open") return true;
  if (v === "closed") return false;
  return null;
}

function defaultOpenForPath() {
  return true;
}

export function ShellLayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpenState] = useState(true);

  useEffect(() => {
    const stored = readStored();
    setSidebarOpenState(stored ?? defaultOpenForPath());
  }, []);

  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open);
    window.localStorage.setItem(STORAGE_KEY, open ? "open" : "closed");
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpenState((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "open" : "closed");
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ sidebarOpen, setSidebarOpen, toggleSidebar }),
    [sidebarOpen, setSidebarOpen, toggleSidebar],
  );

  return (
    <ShellLayoutContext.Provider value={value}>
      {children}
    </ShellLayoutContext.Provider>
  );
}

export function useShellLayout() {
  const ctx = useContext(ShellLayoutContext);
  if (!ctx) {
    throw new Error("useShellLayout must be used inside ShellLayoutProvider");
  }
  return ctx;
}
