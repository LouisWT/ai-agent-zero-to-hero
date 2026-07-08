import { createSystemMessage, type Message } from "./messages.js";

export const DEFAULT_SYSTEM_PROMPT = "You are a helpful teaching agent.";
export const DEFAULT_RUNTIME_POLICY =
  "You are running in an interactive CLI. Slash commands are handled locally and are not model instructions.";
export const DEFAULT_CONTEXT_CHARACTER_BUDGET = 4000;

export interface PromptLayer {
  name: string;
  messages: readonly Message[];
  required?: boolean;
}

export interface ContextBuilderOptions {
  systemPrompt?: string;
  runtimePolicy?: string;
  maxCharacters?: number;
  layers?: readonly PromptLayer[];
}

export interface ContextLayerSnapshot {
  name: string;
  required: boolean;
  messages: readonly Message[];
  characters: number;
  omittedMessages: number;
}

export interface BuiltContext {
  messages: readonly Message[];
  layers: readonly ContextLayerSnapshot[];
  maxCharacters: number;
  usedCharacters: number;
  omittedMessages: number;
}

export class ContextBuilder {
  private readonly maxCharacters: number;
  private readonly layers: PromptLayer[];

  constructor(options: ContextBuilderOptions = {}) {
    this.maxCharacters = options.maxCharacters ?? DEFAULT_CONTEXT_CHARACTER_BUDGET;
    if (this.maxCharacters <= 0) {
      throw new Error("Context character budget must be greater than zero.");
    }

    this.layers = [
      {
        name: "base-system",
        required: true,
        messages: [createSystemMessage(options.systemPrompt ?? DEFAULT_SYSTEM_PROMPT)]
      },
      {
        name: "runtime-policy",
        required: true,
        messages: [createSystemMessage(options.runtimePolicy ?? DEFAULT_RUNTIME_POLICY)]
      },
      ...(options.layers ?? [])
    ];
  }

  addLayer(layer: PromptLayer): void {
    this.layers.push(layer);
  }

  build(conversationMessages: readonly Message[]): BuiltContext {
    const messages: Message[] = [];
    const snapshots: ContextLayerSnapshot[] = [];
    let usedCharacters = 0;
    let omittedMessages = 0;

    for (const layer of this.layers) {
      const required = layer.required ?? true;
      const layerCharacters = countMessages(layer.messages);

      if (!required && usedCharacters + layerCharacters > this.maxCharacters) {
        snapshots.push({
          name: layer.name,
          required,
          messages: [],
          characters: 0,
          omittedMessages: layer.messages.length
        });
        omittedMessages += layer.messages.length;
        continue;
      }

      messages.push(...layer.messages);
      usedCharacters += layerCharacters;
      snapshots.push({
        name: layer.name,
        required,
        messages: [...layer.messages],
        characters: layerCharacters,
        omittedMessages: 0
      });
    }

    const recent = selectRecentMessages(conversationMessages, Math.max(0, this.maxCharacters - usedCharacters));
    messages.push(...recent.messages);
    usedCharacters += countMessages(recent.messages);
    omittedMessages += recent.omittedMessages;
    snapshots.push({
      name: "recent-conversation",
      required: false,
      messages: recent.messages,
      characters: countMessages(recent.messages),
      omittedMessages: recent.omittedMessages
    });

    return {
      messages,
      layers: snapshots,
      maxCharacters: this.maxCharacters,
      usedCharacters,
      omittedMessages
    };
  }
}

export function formatBuiltContext(context: BuiltContext): string {
  const lines = [
    `Context budget: ${context.usedCharacters}/${context.maxCharacters} characters`,
    `Omitted messages: ${context.omittedMessages}`,
    "Layers:"
  ];

  for (const layer of context.layers) {
    lines.push(
      `- ${layer.name}: ${layer.messages.length} message(s), ${layer.characters} characters${
        layer.omittedMessages > 0 ? `, omitted ${layer.omittedMessages}` : ""
      }`
    );
  }

  lines.push("Provider messages:");
  context.messages.forEach((message, index) => {
    lines.push(`${index + 1}. ${message.role}: ${message.content}`);
  });

  return lines.join("\n");
}

function selectRecentMessages(messages: readonly Message[], budget: number): { messages: Message[]; omittedMessages: number } {
  const selected: Message[] = [];
  let usedCharacters = 0;

  for (const message of [...messages].reverse()) {
    const messageCharacters = countMessage(message);
    if (selected.length > 0 && usedCharacters + messageCharacters > budget) {
      break;
    }

    selected.push(message);
    usedCharacters += messageCharacters;
  }

  selected.reverse();

  return {
    messages: selected,
    omittedMessages: messages.length - selected.length
  };
}

function countMessages(messages: readonly Message[]): number {
  return messages.reduce((total, message) => total + countMessage(message), 0);
}

function countMessage(message: Message): number {
  return message.role.length + message.content.length;
}
