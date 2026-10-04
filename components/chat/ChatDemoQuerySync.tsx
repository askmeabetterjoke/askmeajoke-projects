"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useChatDemo } from "./ChatDemoProvider";

/** Applies ?demo=dry and ?preflight=1 query flags on the home chat route. */
export function ChatDemoQuerySync() {
  const searchParams = useSearchParams();
  const demo = useChatDemo();

  useEffect(() => {
    if (searchParams.get("demo") === "dry") {
      demo.setDryRun(true);
    }
    if (searchParams.get("preflight") === "1") {
      demo.setDemoOpen(true);
    }
  }, [demo, searchParams]);

  return null;
}
