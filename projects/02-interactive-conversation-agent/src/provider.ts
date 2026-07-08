import { createAssistantMessage, type Message } from "./messages.js";

export interface ModelRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ProviderRequest {
  messages: readonly Message[];
  options?: ModelRequestOptions;
}

export interface ProviderStreamChunk {
  type: "chunk";
  content: string;
}

export interface Provider {
  generate(request: ProviderRequest): Promise<Message>;
  stream?(request: ProviderRequest): AsyncIterable<ProviderStreamChunk>;
}

export class MockProvider implements Provider {
  async generate(request: ProviderRequest): Promise<Message> {
    return createAssistantMessage(createMockResponse(request.messages));
  }

  async *stream(request: ProviderRequest): AsyncIterable<ProviderStreamChunk> {
    const response = await this.generate(request);

    for (const content of splitIntoDisplayChunks(response.content)) {
      yield {
        type: "chunk",
        content
      };
    }
  }
}

export interface OpenAICompatibleProviderOptions {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  apiVersion?: string;
  fetch?: FetchLike;
}

export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export class OpenAICompatibleProvider implements Provider {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly apiVersion?: string;
  private readonly useApiKeyHeader: boolean;
  private readonly includeModelInRequest: boolean;
  private readonly fetchImpl: FetchLike;

  constructor(options: OpenAICompatibleProviderOptions) {
    const apiKey = options.apiKey.trim();
    if (!apiKey) {
      throw new Error("OpenAI-compatible provider requires OPENAI_API_KEY.");
    }

    this.apiKey = apiKey;
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.model = normalizeModel(options.model);
    this.apiVersion = normalizeOptional(options.apiVersion, "OPENAI_API_VERSION");
    this.useApiKeyHeader = shouldUseApiKeyHeader(this.baseUrl, this.apiVersion);
    this.includeModelInRequest = !isAzureDeploymentUrl(this.baseUrl);
    this.fetchImpl = options.fetch ?? fetch;
  }

  async generate(request: ProviderRequest): Promise<Message> {
    const response = await this.fetchChatCompletion(request, false);

    if (!response.ok) {
      throw await createProviderError(response);
    }

    const data: unknown = await response.json();
    return createAssistantMessage(readAssistantContent(data));
  }

  async *stream(request: ProviderRequest): AsyncIterable<ProviderStreamChunk> {
    const response = await this.fetchChatCompletion(request, true);

    if (!response.ok) {
      throw await createProviderError(response);
    }

    if (!response.body) {
      throw new Error("OpenAI-compatible provider streaming response did not include a body.");
    }

    for await (const data of readServerSentEventData(response.body)) {
      if (data === "[DONE]") {
        break;
      }

      const content = readDeltaContent(JSON.parse(data) as unknown);
      if (content) {
        yield {
          type: "chunk",
          content
        };
      }
    }
  }

  private fetchChatCompletion(request: ProviderRequest, stream: boolean): Promise<Response> {
    return this.fetchImpl(buildChatCompletionsUrl(this.baseUrl, this.apiVersion), {
      method: "POST",
      headers: createHeaders(this.apiKey, this.useApiKeyHeader),
      body: JSON.stringify(toChatCompletionBody(request, this.model, this.includeModelInRequest, stream))
    });
  }
}

function createMockResponse(messages: readonly Message[]): string {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const input = lastUserMessage?.content ?? "";
  return `Mock response: I received "${input}".`;
}

function splitIntoDisplayChunks(content: string): string[] {
  return content.match(/\S+\s*/g) ?? [content];
}

async function createProviderError(response: Response): Promise<Error> {
  const body = await response.text();
  return new Error(`OpenAI-compatible provider request failed (${response.status} ${response.statusText}): ${body}`);
}

function normalizeBaseUrl(baseUrl = DEFAULT_OPENAI_BASE_URL): string {
  const normalized = baseUrl.trim().replace(/\/+$/, "");
  if (!normalized) {
    throw new Error("OPENAI_BASE_URL cannot be empty.");
  }

  try {
    new URL(normalized);
  } catch {
    throw new Error("OPENAI_BASE_URL must be a valid URL.");
  }

  return normalized;
}

function normalizeModel(model = DEFAULT_OPENAI_MODEL): string {
  const normalized = model.trim();
  if (!normalized) {
    throw new Error("OPENAI_MODEL cannot be empty.");
  }
  return normalized;
}

function normalizeOptional(value: string | undefined, name: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${name} cannot be empty.`);
  }

  return normalized;
}

function buildChatCompletionsUrl(baseUrl: string, apiVersion: string | undefined): string {
  const url = new URL(baseUrl);
  const suffix = isFoundryProjectUrl(baseUrl) ? "/openai/v1/chat/completions" : "/chat/completions";
  url.pathname = `${url.pathname.replace(/\/+$/, "")}${suffix}`;

  if (apiVersion) {
    url.searchParams.set("api-version", apiVersion);
  }

  return url.toString();
}

function createHeaders(apiKey: string, useApiKeyHeader: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (useApiKeyHeader) {
    headers["api-key"] = apiKey;
  } else {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

function shouldUseApiKeyHeader(baseUrl: string, apiVersion: string | undefined): boolean {
  const url = new URL(baseUrl);
  return apiVersion !== undefined || url.hostname.endsWith(".openai.azure.com") || url.hostname.endsWith(".ai.azure.com");
}

function isAzureDeploymentUrl(baseUrl: string): boolean {
  const url = new URL(baseUrl);
  return url.pathname.includes("/deployments/");
}

function isFoundryProjectUrl(baseUrl: string): boolean {
  const url = new URL(baseUrl);
  return url.hostname.endsWith(".ai.azure.com") && url.pathname.includes("/api/projects/");
}

function toChatCompletionBody(
  request: ProviderRequest,
  defaultModel: string,
  includeModel: boolean,
  stream: boolean
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    messages: request.messages.map((message) => ({
      role: message.role,
      content: message.content
    }))
  };

  if (includeModel) {
    body.model = request.options?.model?.trim() || defaultModel;
  }

  if (request.options?.temperature !== undefined) {
    body.temperature = request.options.temperature;
  }

  if (request.options?.maxTokens !== undefined) {
    body.max_tokens = request.options.maxTokens;
  }

  if (stream) {
    body.stream = true;
  }

  return body;
}

async function* readServerSentEventData(body: ReadableStream<Uint8Array>): AsyncIterable<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");

      let eventEndIndex = buffer.indexOf("\n\n");
      while (eventEndIndex >= 0) {
        const rawEvent = buffer.slice(0, eventEndIndex);
        buffer = buffer.slice(eventEndIndex + 2);

        const data = parseServerSentEventData(rawEvent);
        if (data) {
          yield data;
        }

        eventEndIndex = buffer.indexOf("\n\n");
      }
    }

    const remaining = parseServerSentEventData(buffer);
    if (remaining) {
      yield remaining;
    }
  } finally {
    reader.releaseLock();
  }
}

function parseServerSentEventData(rawEvent: string): string | undefined {
  const dataLines = rawEvent
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice("data:".length).trimStart());

  if (dataLines.length === 0) {
    return undefined;
  }

  return dataLines.join("\n");
}

function readAssistantContent(data: unknown): string {
  if (!isRecord(data) || !Array.isArray(data.choices)) {
    throw new Error("OpenAI-compatible provider response did not include choices.");
  }

  const [choice] = data.choices;
  if (!isRecord(choice) || !isRecord(choice.message) || typeof choice.message.content !== "string") {
    throw new Error("OpenAI-compatible provider response did not include assistant content.");
  }

  return choice.message.content;
}

function readDeltaContent(data: unknown): string | undefined {
  if (!isRecord(data) || !Array.isArray(data.choices)) {
    throw new Error("OpenAI-compatible provider streaming response did not include choices.");
  }

  const [choice] = data.choices;
  if (choice === undefined) {
    return undefined;
  }

  if (!isRecord(choice)) {
    throw new Error("OpenAI-compatible provider streaming response included an invalid choice.");
  }

  if (isRecord(choice.delta) && typeof choice.delta.content === "string") {
    return choice.delta.content;
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
