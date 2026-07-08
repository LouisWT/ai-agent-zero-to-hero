import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { PassThrough } from "node:stream";
import { Agent } from "../src/agent.js";
import { handleCommand, runRepl, writeAssistantReply } from "../src/cli.js";
import { Conversation, formatConversationHistory } from "../src/conversation.js";
import { loadEnvFile, type EnvTarget } from "../src/env.js";
import { createAssistantMessage, createSystemMessage, createUserMessage, type Message } from "../src/messages.js";
import { createProviderFromEnv } from "../src/provider-factory.js";
import {
  MockProvider,
  OpenAICompatibleProvider,
  type FetchLike,
  type Provider,
  type ProviderRequest
} from "../src/provider.js";

class EchoProvider implements Provider {
  readonly requests: ProviderRequest[] = [];

  async generate(request: ProviderRequest): Promise<Message> {
    this.requests.push(request);
    const lastUserMessage = [...request.messages].reverse().find((message) => message.role === "user");
    return createAssistantMessage(`Echo: ${lastUserMessage?.content ?? ""}`);
  }
}

class StreamingProvider implements Provider {
  readonly requests: ProviderRequest[] = [];

  async generate(): Promise<Message> {
    throw new Error("StreamingProvider.generate should not be called when stream is available.");
  }

  async *stream(request: ProviderRequest): AsyncIterable<{ type: "chunk"; content: string }> {
    this.requests.push(request);
    yield {
      type: "chunk",
      content: "Streamed "
    };
    yield {
      type: "chunk",
      content: "reply"
    };
  }
}

function createCaptureStream(): { stream: PassThrough; read: () => string } {
  const stream = new PassThrough();
  const chunks: string[] = [];
  stream.on("data", (chunk: Buffer) => chunks.push(chunk.toString("utf8")));

  return {
    stream,
    read: () => chunks.join("")
  };
}

test("creates user messages", () => {
  const message = createUserMessage("hello");
  assert.equal(message.role, "user");
  assert.equal(message.content, "hello");
  assert.match(message.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("conversation records system, user, and assistant messages", () => {
  const conversation = new Conversation({ systemPrompt: "System prompt" });
  conversation.addUserMessage("hello");
  conversation.addAssistantMessage("hi");

  assert.deepEqual(
    conversation.getMessages().map((message) => message.role),
    ["system", "user", "assistant"]
  );
  assert.match(formatConversationHistory(conversation), /1\. system: System prompt/);
  assert.match(formatConversationHistory(conversation), /2\. user: hello/);
  assert.match(formatConversationHistory(conversation), /3\. assistant: hi/);
});

test("agent keeps multi-turn history in provider requests", async () => {
  const provider = new EchoProvider();
  const agent = new Agent({ provider, systemPrompt: "Stay concise." });

  await agent.chat("hello");
  await agent.chat("again");

  assert.equal(provider.requests.length, 2);
  assert.deepEqual(
    provider.requests[1].messages.map((message) => message.role),
    ["system", "user", "assistant", "user"]
  );
  assert.equal(provider.requests[1].messages[0].content, "Stay concise.");
  assert.equal(provider.requests[1].messages[1].content, "hello");
  assert.equal(provider.requests[1].messages[2].content, "Echo: hello");
  assert.equal(provider.requests[1].messages[3].content, "again");
});

test("minimal agent returns a mock assistant response", async () => {
  const agent = new Agent({ provider: new MockProvider() });
  const response = await agent.chat("hello");
  assert.equal(response.role, "assistant");
  assert.match(response.content, /hello/);
});

test("agent streams chunks and stores one complete assistant message", async () => {
  const provider = new StreamingProvider();
  const agent = new Agent({ provider });
  const events = [];

  for await (const event of agent.streamChat("hello")) {
    events.push(event);
  }

  assert.deepEqual(
    events.filter((event) => event.type === "chunk").map((event) => event.content),
    ["Streamed ", "reply"]
  );

  const finalEvent = events.at(-1);
  assert.equal(finalEvent?.type, "message");
  assert.equal(finalEvent?.message.content, "Streamed reply");
  assert.equal(agent.getConversation().getMessages().at(-1)?.content, "Streamed reply");
  assert.equal(provider.requests.length, 1);
});

test("agent streamChat falls back to generate when provider streaming is unavailable", async () => {
  const provider = new EchoProvider();
  const agent = new Agent({ provider });
  const chunks: string[] = [];

  for await (const event of agent.streamChat("hello")) {
    if (event.type === "chunk") {
      chunks.push(event.content);
    }
  }

  assert.deepEqual(chunks, ["Echo: hello"]);
  assert.equal(agent.getConversation().getMessages().at(-1)?.content, "Echo: hello");
});

test("history command does not call the provider", async () => {
  const provider = new EchoProvider();
  const agent = new Agent({ provider });
  await agent.chat("hello");
  const callsBeforeHistory = provider.requests.length;
  const capture = createCaptureStream();

  const result = handleCommand("/history", agent, capture.stream);

  assert.equal(result, "continue");
  assert.equal(provider.requests.length, callsBeforeHistory);
  assert.match(capture.read(), /user: hello/);
  assert.match(capture.read(), /assistant: Echo: hello/);
});

test("exit command ends the REPL loop", () => {
  const capture = createCaptureStream();
  const result = handleCommand("/exit", new Agent({ provider: new EchoProvider() }), capture.stream);

  assert.equal(result, "exit");
  assert.match(capture.read(), /Goodbye/);
});

test("writeAssistantReply renders streamed chunks", async () => {
  const capture = createCaptureStream();
  const response = await writeAssistantReply(new Agent({ provider: new StreamingProvider() }), "hello", capture.stream);

  assert.equal(response.content, "Streamed reply");
  assert.equal(capture.read(), "assistant> Streamed reply\n");
});

test("REPL processes piped conversation and commands", async () => {
  const input = new PassThrough();
  const capture = createCaptureStream();
  const provider = new EchoProvider();
  const repl = runRepl(new Agent({ provider }), {
    input,
    output: capture.stream
  });

  input.write("hello\n");
  input.write("/history\n");
  input.write("/exit\n");
  input.end();

  await repl;

  assert.equal(provider.requests.length, 1);
  assert.match(capture.read(), /assistant> Echo: hello/);
  assert.match(capture.read(), /user: hello/);
  assert.match(capture.read(), /Goodbye/);
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
    messages: [createSystemMessage("You are concise."), createUserMessage("hello")],
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

test("OpenAI-compatible provider streams chat completion chunks", async () => {
  let requestedInit: RequestInit | undefined;
  const encoder = new TextEncoder();
  const fakeFetch: FetchLike = async (_url, init) => {
    requestedInit = init;

    return new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(
            encoder.encode('data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n')
          );
          controller.enqueue(
            encoder.encode('data: {"choices":[{"delta":{"content":"lo"}}]}\n\n')
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream"
        }
      }
    );
  };

  const provider = new OpenAICompatibleProvider({
    apiKey: "test-key",
    baseUrl: "https://models.example/v1",
    model: "test-model",
    fetch: fakeFetch
  });

  const stream = provider.stream?.({
    messages: [createUserMessage("hello")]
  });
  assert.ok(stream);

  const chunks: string[] = [];
  for await (const event of stream) {
    chunks.push(event.content);
  }

  assert.deepEqual(chunks, ["Hel", "lo"]);

  const body = JSON.parse(String(requestedInit?.body)) as Record<string, unknown>;
  assert.equal(body.stream, true);
});

test("OpenAI-compatible provider ignores streaming events without content", async () => {
  const encoder = new TextEncoder();
  const fakeFetch: FetchLike = async () => {
    return new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"choices":[]}\n\n'));
          controller.enqueue(
            encoder.encode('data: {"choices":[{"delta":{"role":"assistant"}}]}\n\n')
          );
          controller.enqueue(
            encoder.encode('data: {"choices":[{"delta":{"content":"Hi"}}]}\n\n')
          );
          controller.enqueue(encoder.encode('data: {"choices":[{"delta":{}}]}\n\n'));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream"
        }
      }
    );
  };

  const provider = new OpenAICompatibleProvider({
    apiKey: "test-key",
    baseUrl: "https://models.example/v1",
    model: "test-model",
    fetch: fakeFetch
  });

  const chunks: string[] = [];
  for await (const event of provider.stream?.({ messages: [createUserMessage("hello")] }) ?? []) {
    chunks.push(event.content);
  }

  assert.deepEqual(chunks, ["Hi"]);
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
