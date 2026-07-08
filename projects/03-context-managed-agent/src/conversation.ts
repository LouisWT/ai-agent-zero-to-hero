import { createAssistantMessage, createUserMessage, type Message } from "./messages.js";

export interface ConversationOptions {
  messages?: readonly Message[];
}

export class Conversation {
  private readonly messages: Message[];

  constructor(options: ConversationOptions = {}) {
    this.messages = options.messages ? [...options.messages] : [];
  }

  getMessages(): readonly Message[] {
    return [...this.messages];
  }

  addUserMessage(content: string): Message {
    return this.addMessage(createUserMessage(content));
  }

  addAssistantMessage(content: string): Message {
    return this.addMessage(createAssistantMessage(content));
  }

  addMessage(message: Message): Message {
    this.messages.push(message);
    return message;
  }
}

export function formatConversationHistory(conversation: Conversation): string {
  const messages = conversation.getMessages();
  if (messages.length === 0) {
    return "No messages yet.";
  }

  return messages.map((message, index) => `${index + 1}. ${message.role}: ${message.content}`).join("\n");
}
