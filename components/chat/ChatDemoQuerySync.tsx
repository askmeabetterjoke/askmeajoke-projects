"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useChatDemo } from "./ChatDemoProvider";

/** Applies ?demo=dry and ?preflight=1 query flags on the home chat route. */
export function ChatDemoQuerySync() {
  const searchParams = useSearchParams();
  const { setDryRun, setDemoOpen } = useChatDemo();

  // Apply URL flags only when the query string changes — do not depend on full
  // demo context or toggling dry run off gets overwritten immediately.
  useEffect(() => {
    if (searchParams.get("demo") === "dry") {
      setDryRun(true);
    }
    if (searchParams.get("preflight") === "1") {
      setDemoOpen(true);
    }
  }, [searchParams, setDryRun, setDemoOpen]);

  return null;
}
