# 03 - Context Managed Agent

## Goal

Teach the agent to build a bounded model context from explicit prompt layers instead of scattering prompt strings across the agent.

## Copy-forward source

Copy from `02-interactive-conversation-agent`.

```bash
npm run copy-forward -- 02-interactive-conversation-agent 03-context-managed-agent
```

## Implementation focus

- Add `ContextBuilder`.
- Introduce named prompt/context layers such as base system instructions, runtime policy, memory, skills, summaries, and recent conversation.
- Keep stable layers stable so later memory and skill injection can be managed deliberately.
- Include recent messages within a character budget.
- Add `/context` to inspect what will be sent to the provider.
- Update the copied package name to `@ai-agent-zero-to-hero/03-context-managed-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/03-context-managed-agent dev
npm run --workspace @ai-agent-zero-to-hero/03-context-managed-agent test
```

## Hermes mapping

Maps to Hermes `build_turn_context()` and system prompt layering, simplified for teaching. This project becomes the central prompt assembly point that later memory, skills, tools, and compression features extend instead of each feature concatenating prompts on its own.

## Acceptance criteria

- Long histories are trimmed before provider calls.
- Prompt content is assembled through `ContextBuilder` from named layers.
- `/context` shows the actual context.
- Tests cover layer ordering, system prompt retention, and budget trimming.
