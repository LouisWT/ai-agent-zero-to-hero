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

export interface Provider {
  generate(request: ProviderRequest): Promise<Message>;
}

export class MockProvider implements Provider {
  async generate(request: ProviderRequest): Promise<Message> {
    const { messages } = request;
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    const input = lastUserMessage?.content ?? "";
    return createAssistantMessage(`Mock response: I received "${input}".`);
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
    const response = await this.fetchImpl(buildChatCompletionsUrl(this.baseUrl, this.apiVersion), {
      method: "POST",
      headers: createHeaders(this.apiKey, this.useApiKeyHeader),
      body: JSON.stringify(toChatCompletionBody(request, this.model, this.includeModelInRequest))
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `OpenAI-compatible provider request failed (${response.status} ${response.statusText}): ${body}`
      );
    }

    const data: unknown = await response.json();
    return createAssistantMessage(readAssistantContent(data));
  }
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
  includeModel: boolean
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

  return body;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
