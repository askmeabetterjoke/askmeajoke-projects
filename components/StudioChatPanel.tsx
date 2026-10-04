"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

export function StudioChatPanel({
  agentId,
  title,
  welcome,
  placeholder,
}: {
  agentId: string;
  title: string;
  welcome: string;
  placeholder: string;
}) {
  return (
    <div className="studio-chat-panel h-full min-h-0">
      <CopilotChat
        agentId={agentId}
        className="h-full min-h-0"
        labels={{
          modalHeaderTitle: title,
          welcomeMessageText: welcome,
          chatInputPlaceholder: placeholder,
        }}
      />
    </div>
  );
}
