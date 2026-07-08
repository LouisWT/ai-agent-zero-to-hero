import { createSystemMessage, createUserMessage, type Message } from "./messages.js";
import { MockProvider, type Provider } from "./provider.js";

export interface AgentOptions {
  systemPrompt?: string;
  provider?: Provider;
}

export class Agent {
  private readonly systemPrompt: string;
  private readonly provider: Provider;

  constructor(options: AgentOptions = {}) {
    this.systemPrompt = options.systemPrompt ?? "You are a helpful teaching agent.";
    this.provider = options.provider ?? new MockProvider();
  }

  async chat(input: string): Promise<Message> {
    const messages = [
      createSystemMessage(this.systemPrompt),
      createUserMessage(input)
    ];

    return this.provider.generate(messages);
  }
}

