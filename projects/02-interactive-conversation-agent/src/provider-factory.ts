import { MockProvider, OpenAICompatibleProvider, type Provider } from "./provider.js";

export interface ProviderEnvironment {
  OPENAI_API_KEY?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_MODEL?: string;
  OPENAI_API_VERSION?: string;
  AZURE_OPENAI_API_VERSION?: string;
}

export function createProviderFromEnv(env: ProviderEnvironment = process.env): Provider {
  const apiKey = env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return new MockProvider();
  }

  return new OpenAICompatibleProvider({
    apiKey,
    baseUrl: env.OPENAI_BASE_URL,
    model: env.OPENAI_MODEL,
    apiVersion: firstConfigured(env.OPENAI_API_VERSION, env.AZURE_OPENAI_API_VERSION)
  });
}

function firstConfigured(...values: Array<string | undefined>): string | undefined {
  return values.find((value) => value !== undefined && value.trim() !== "");
}
