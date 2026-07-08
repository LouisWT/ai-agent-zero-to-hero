# 03 - Context Managed Agent

## Goal

Teach the agent to build a bounded model context instead of blindly sending all conversation history.

## Copy-forward source

Copy from `02-interactive-conversation-agent`.

```bash
npm run copy-forward -- 02-interactive-conversation-agent 03-context-managed-agent
```

## Implementation focus

- Add `ContextBuilder`.
- Keep system prompt stable.
- Include recent messages within a character budget.
- Add `/context` to inspect what will be sent to the provider.
- Update the copied package name to `@ai-agent-zero-to-hero/03-context-managed-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/03-context-managed-agent dev
npm run --workspace @ai-agent-zero-to-hero/03-context-managed-agent test
```

## Hermes mapping

Maps to Hermes `build_turn_context()` and system prompt layering, simplified for teaching.

## Acceptance criteria

- Long histories are trimmed before provider calls.
- `/context` shows the actual context.
- Tests cover budget trimming.

