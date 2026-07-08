# 15 - HTTP Gateway Agent

## Goal

Expose the agent through HTTP so external systems can send messages without using the CLI.

## Copy-forward source

Copy from `14-scheduled-agent`.

```bash
npm run copy-forward -- 14-scheduled-agent 15-http-gateway-agent
```

## Implementation focus

- Add Fastify or Express.
- Add `POST /chat`.
- Use a session key to route conversations.
- Reuse sessions for the same key.
- Return assistant replies and tool events as JSON.
- Update the copied package name to `@ai-agent-zero-to-hero/15-http-gateway-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/15-http-gateway-agent dev
npm run --workspace @ai-agent-zero-to-hero/15-http-gateway-agent test
```

## Hermes mapping

Maps to Hermes gateway/API-server concepts without implementing all platform adapters.

## Acceptance criteria

- `POST /chat` accepts a message and returns an assistant reply.
- The same session key continues the same conversation.
- Tool events are included in the response.

