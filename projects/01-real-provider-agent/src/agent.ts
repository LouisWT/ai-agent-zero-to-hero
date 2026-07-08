import { createSystemMessage, createUserMessage, type Message } from "./messages.js";
import { createProviderFromEnv } from "./provider-factory.js";
import type { ModelRequestOptions, Provider } from "./provider.js";

export interface AgentOptions {
  systemPrompt?: string;
  provider?: Provider;
  modelOptions?: ModelRequestOptions;
}

export class Agent {
  private readonly systemPrompt: string;
  private readonly provider: Provider;
  private readonly modelOptions: ModelRequestOptions;

  constructor(options: AgentOptions = {}) {
    this.systemPrompt = options.systemPrompt ?? "You are a helpful teaching agent.";
    this.provider = options.provider ?? createProviderFromEnv();
    this.modelOptions = options.modelOptions ?? {};
  }

  async chat(input: string): Promise<Message> {
    const messages = [
      createSystemMessage(this.systemPrompt),
      createUserMessage(input)
    ];

    return this.provider.generate({
      messages,
      options: this.modelOptions
    });
  }
}
