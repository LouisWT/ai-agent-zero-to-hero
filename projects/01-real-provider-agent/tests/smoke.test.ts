import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Agent } from "../src/agent.js";
import { loadEnvFile, type EnvTarget } from "../src/env.js";
import { createSystemMessage, createUserMessage } from "../src/messages.js";
import { createProviderFromEnv } from "../src/provider-factory.js";
import { MockProvider, OpenAICompatibleProvider, type FetchLike } from "../src/provider.js";

test("creates user messages", () => {
  const message = createUserMessage("hello");
  assert.equal(message.role, "user");
  assert.equal(message.content, "hello");
  assert.match(message.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("minimal agent returns a mock assistant response", async () => {
  const agent = new Agent({ provider: new MockProvider() });
  const response = await agent.chat("hello");
  assert.equal(response.role, "assistant");
  assert.match(response.content, /hello/);
});

test("provider factory defaults to mock mode without credentials", () => {
  const provider = createProviderFromEnv({});
  assert.ok(provider instanceof MockProvider);
});

test("provider factory selects OpenAI-compatible mode when an API key is configured", () => {
  const provider = createProviderFromEnv({
    OPENAI_API_KEY: "test-key",
    OPENAI_BASE_URL: "https://models.example/v1",
    OPENAI_MODEL: "test-model"
  });

  assert.ok(provider instanceof OpenAICompatibleProvider);
});

test("OpenAI-compatible provider normalizes chat completion requests", async () => {
  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;
  const fakeFetch: FetchLike = async (url, init) => {
    requestedUrl = url;
    requestedInit = init;
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: "Real-ish response"
            }
          }
        ]
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  };

  const provider = new OpenAICompatibleProvider({
    apiKey: "test-key",
    baseUrl: "https://models.example/v1/",
    model: "test-model",
    fetch: fakeFetch
  });

  const response = await provider.generate({
    messages: [
      createSystemMessage("You are concise."),
      createUserMessage("hello")
    ],
    options: {
      temperature: 0.2,
      maxTokens: 20
    }
  });

  assert.equal(response.role, "assistant");
  assert.equal(response.content, "Real-ish response");
  assert.equal(requestedUrl, "https://models.example/v1/chat/completions");
  assert.equal(requestedInit?.method, "POST");

  const headers = requestedInit?.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer test-key");
  assert.equal(headers["Content-Type"], "application/json");

  const body = JSON.parse(String(requestedInit?.body)) as Record<string, unknown>;
  assert.equal(body.model, "test-model");
  assert.deepEqual(body.messages, [
    {
      role: "system",
      content: "You are concise."
    },
    {
      role: "user",
      content: "hello"
    }
  ]);
  assert.equal(body.temperature, 0.2);
  assert.equal(body.max_tokens, 20);
});

test("OpenAI-compatible provider supports Azure deployment endpoints", async () => {
  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;
  const fakeFetch: FetchLike = async (url, init) => {
    requestedUrl = url;
    requestedInit = init;
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: "Azure response"
            }
          }
        ]
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  };

  const provider = new OpenAICompatibleProvider({
    apiKey: "test-key",
    baseUrl: "https://example.openai.azure.com/openai/deployments/test-deployment",
    model: "test-model",
    apiVersion: "2024-02-15-preview",
    fetch: fakeFetch
  });

  const response = await provider.generate({
    messages: [createUserMessage("hello")]
  });

  assert.equal(response.content, "Azure response");
  assert.equal(
    requestedUrl,
    "https://example.openai.azure.com/openai/deployments/test-deployment/chat/completions?api-version=2024-02-15-preview"
  );

  const headers = requestedInit?.headers as Record<string, string>;
  assert.equal(headers["api-key"], "test-key");
  assert.equal(headers.Authorization, undefined);

  const body = JSON.parse(String(requestedInit?.body)) as Record<string, unknown>;
  assert.equal(body.model, undefined);
});

test("OpenAI-compatible provider supports Foundry project endpoints", async () => {
  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;
  const fakeFetch: FetchLike = async (url, init) => {
    requestedUrl = url;
    requestedInit = init;
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: "Foundry response"
            }
          }
        ]
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  };

  const provider = new OpenAICompatibleProvider({
    apiKey: "test-key",
    baseUrl: "https://example.services.ai.azure.com/api/projects/test-project",
    model: "test-model",
    fetch: fakeFetch
  });

  const response = await provider.generate({
    messages: [createUserMessage("hello")]
  });

  assert.equal(response.content, "Foundry response");
  assert.equal(
    requestedUrl,
    "https://example.services.ai.azure.com/api/projects/test-project/openai/v1/chat/completions"
  );

  const headers = requestedInit?.headers as Record<string, string>;
  assert.equal(headers["api-key"], "test-key");
  assert.equal(headers.Authorization, undefined);

  const body = JSON.parse(String(requestedInit?.body)) as Record<string, unknown>;
  assert.equal(body.model, "test-model");
});

test("loads .env files without overriding existing environment", () => {
  const tempDir = mkdtempSync(path.join(tmpdir(), "ai-agent-env-"));
  const envPath = path.join(tempDir, ".env");
  const env: EnvTarget = {
    OPENAI_MODEL: "existing-model"
  };

  try {
    writeFileSync(
      envPath,
      [
        "OPENAI_API_KEY=test-key",
        "OPENAI_BASE_URL=\"https://models.example/v1\"",
        "OPENAI_MODEL=file-model"
      ].join("\n")
    );

    loadEnvFile(envPath, env);

    assert.equal(env.OPENAI_API_KEY, "test-key");
    assert.equal(env.OPENAI_BASE_URL, "https://models.example/v1");
    assert.equal(env.OPENAI_MODEL, "existing-model");
  } finally {
    rmSync(tempDir, {
      recursive: true,
      force: true
    });
  }
});
