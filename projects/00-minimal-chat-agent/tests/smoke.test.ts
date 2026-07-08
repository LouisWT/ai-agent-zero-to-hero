import test from "node:test";
import assert from "node:assert/strict";
import { Agent } from "../src/agent.js";
import { createUserMessage } from "../src/messages.js";
import { MockProvider } from "../src/provider.js";

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

