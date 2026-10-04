"use client";

import { StudioChatPanel } from "./StudioChatPanel";

/** @deprecated Use ResizableSplitLayout + StudioChatPanel on each page. */
export function StudioChat(props: {
  agentId: string;
  title: string;
  welcome: string;
  placeholder: string;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <StudioChatPanel {...props} />
    </div>
  );
}
