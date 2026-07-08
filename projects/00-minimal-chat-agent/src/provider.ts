import { createAssistantMessage, type Message } from "./messages.js";

export interface Provider {
  generate(messages: readonly Message[]): Promise<Message>;
}

export class MockProvider implements Provider {
  async generate(messages: readonly Message[]): Promise<Message> {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    const input = lastUserMessage?.content ?? "";
    return createAssistantMessage(`Mock response: I received "${input}".`);
  }
}

