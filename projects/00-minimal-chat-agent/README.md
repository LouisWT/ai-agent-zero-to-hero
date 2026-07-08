# 00 - Minimal Chat Agent

## Goal

Build the first runnable agent snapshot: a CLI that accepts one user message and returns a mock assistant reply.

## Copy-forward source

None. This is the reference project that later lessons copy from.

## Implementation focus

- `src/messages.ts` defines `Message` and helper constructors.
- `src/provider.ts` defines `Provider` and `MockProvider`.
- `src/agent.ts` defines `Agent.chat(input)`.
- `src/index.ts` wires the agent to a CLI.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/00-minimal-chat-agent dev -- "hello agent"
npm run --workspace @ai-agent-zero-to-hero/00-minimal-chat-agent test
npm run --workspace @ai-agent-zero-to-hero/00-minimal-chat-agent typecheck
```

## Hermes mapping

This mirrors the smallest useful slice of Hermes: a message shape, an agent object, and a provider boundary. Hermes grows this into `AIAgent.chat()` and the full conversation loop.

## Acceptance criteria

- Running the dev command prints a mock assistant response.
- Tests cover message creation and `Agent.chat`.
- No real model credentials are required.
