import { Conversation } from "./conversation.js";
import { ContextBuilder, type BuiltContext, type ContextBuilderOptions } from "./context.js";
import type { Message } from "./messages.js";
import { createProviderFromEnv } from "./provider-factory.js";
import type { ModelRequestOptions, Provider } from "./provider.js";

export interface AgentOptions {
  systemPrompt?: string;
  provider?: Provider;
  modelOptions?: ModelRequestOptions;
  conversation?: Conversation;
  contextBuilder?: ContextBuilder;
  context?: ContextBuilderOptions;
}

export interface AgentStreamChunk {
  type: "chunk";
  content: string;
}

export interface AgentStreamComplete {
  type: "message";
  message: Message;
}

export type AgentStreamEvent = AgentStreamChunk | AgentStreamComplete;

export class Agent {
  private readonly provider: Provider;
  private readonly modelOptions: ModelRequestOptions;
  private readonly conversation: Conversation;
  private readonly contextBuilder: ContextBuilder;

  constructor(options: AgentOptions = {}) {
    this.provider = options.provider ?? createProviderFromEnv();
    this.modelOptions = options.modelOptions ?? {};
    this.conversation = options.conversation ?? new Conversation();
    this.contextBuilder =
      options.contextBuilder ??
      new ContextBuilder({
        ...options.context,
        systemPrompt: options.context?.systemPrompt ?? options.systemPrompt
      });
  }

  getConversation(): Conversation {
    return this.conversation;
  }

  getContextBuilder(): ContextBuilder {
    return this.contextBuilder;
  }

  previewContext(): BuiltContext {
    return this.contextBuilder.build(this.conversation.getMessages());
  }

  async chat(input: string): Promise<Message> {
    let response: Message | undefined;

    for await (const event of this.streamChat(input)) {
      if (event.type === "message") {
        response = event.message;
      }
    }

    if (!response) {
      throw new Error("Provider did not produce an assistant message.");
    }

    return response;
  }

  async *streamChat(input: string): AsyncIterable<AgentStreamEvent> {
    this.conversation.addUserMessage(input);

    const context = this.previewContext();
    const request = {
      messages: context.messages,
      options: this.modelOptions
    };

    if (this.provider.stream) {
      const chunks: string[] = [];

      for await (const chunk of this.provider.stream(request)) {
        chunks.push(chunk.content);
        yield chunk;
      }

      const message = this.conversation.addAssistantMessage(chunks.join(""));
      yield {
        type: "message",
        message
      };
      return;
    }

    const message = this.conversation.addMessage(await this.provider.generate(request));
    yield {
      type: "chunk",
      content: message.content
    };
    yield {
      type: "message",
      message
    };
  }
}
