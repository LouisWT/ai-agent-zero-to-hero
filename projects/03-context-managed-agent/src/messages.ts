export type MessageRole = "system" | "user" | "assistant";

export interface Message {
  role: MessageRole;
  content: string;
  createdAt: string;
}

export function createMessage(role: MessageRole, content: string): Message {
  return {
    role,
    content,
    createdAt: new Date().toISOString()
  };
}

export function createUserMessage(content: string): Message {
  return createMessage("user", content);
}

export function createAssistantMessage(content: string): Message {
  return createMessage("assistant", content);
}

export function createSystemMessage(content: string): Message {
  return createMessage("system", content);
}

