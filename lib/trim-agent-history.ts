import type { Message } from "@copilotkit/shared";

const MAX_TAIL_MESSAGES = 16;
const MAX_OLD_CONTENT_CHARS = 1800;
const RECENT_FULL_MESSAGES = 4;

type AgentLike = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
};

function shrinkContent(content: unknown, aggressive: boolean): unknown {
  if (content == null) return content;

  if (typeof content === "string") {
    if (!aggressive || content.length <= MAX_OLD_CONTENT_CHARS) return content;
    return `${content.slice(0, MAX_OLD_CONTENT_CHARS)}…[truncated]`;
  }

  if (!Array.isArray(content)) return content;

  const parts = content
    .filter(
      (part) =>
        typeof part === "object" &&
        part !== null &&
        part.type !== "document" &&
        part.type !== "image" &&
        part.type !== "audio" &&
        part.type !== "video",
    )
    .map((part) => {
      if (
        aggressive &&
        typeof part === "object" &&
        part !== null &&
        part.type === "text" &&
        typeof part.text === "string" &&
        part.text.length > MAX_OLD_CONTENT_CHARS
      ) {
        return {
          ...part,
          text: `${part.text.slice(0, MAX_OLD_CONTENT_CHARS)}…[truncated]`,
        };
      }
      return part;
    });

  if (parts.length === 0) {
    return aggressive
      ? "[Attachment omitted from history to save context]"
      : content;
  }

  return parts;
}

function shrinkMessage(message: Message, aggressive: boolean): Message {
  if (!("content" in message) || message.content === undefined) {
    return message;
  }
  const nextContent = shrinkContent(message.content, aggressive);
  if (nextContent === message.content) return message;
  return { ...message, content: nextContent } as Message;
}

/** Keeps demo/long sessions under OpenAI TPM limits for gpt-4o family models. */
export function trimAgentHistory(agent: AgentLike) {
  const { messages } = agent;
  if (messages.length === 0) return;

  const tailStart = Math.max(0, messages.length - MAX_TAIL_MESSAGES);
  const kept = messages.slice(tailStart);

  const shaped = kept.map((message, index) => {
    const isRecent = index >= kept.length - RECENT_FULL_MESSAGES;
    return shrinkMessage(message, !isRecent);
  });

  if (shaped.length !== messages.length) {
    agent.setMessages(shaped);
    return;
  }

  const changed = shaped.some((message, index) => {
    const prev = messages[index];
    return (
      prev !== message &&
      ("content" in message
        ? message.content !== ("content" in prev ? prev.content : undefined)
        : false)
    );
  });

  if (changed) {
    agent.setMessages(shaped);
  }
}
