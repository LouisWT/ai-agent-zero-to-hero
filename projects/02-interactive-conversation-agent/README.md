# 02 - Interactive Conversation Agent

## Goal

Turn the one-shot provider agent into an interactive multi-turn CLI with streaming assistant output.

## Copy-forward source

Copy from `01-real-provider-agent`.

```bash
npm run copy-forward -- 01-real-provider-agent 02-interactive-conversation-agent
```

## Implementation focus

- Add a readline REPL.
- Add a `Conversation` object that records system, user, and assistant messages.
- Add optional provider streaming so the CLI can render assistant output incrementally while preserving a complete assistant message in history.
- Add slash commands: `/help`, `/history`, `/exit`.
- Keep provider selection from the previous project.
- Update the copied package name to `@ai-agent-zero-to-hero/02-interactive-conversation-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/02-interactive-conversation-agent dev
npm run --workspace @ai-agent-zero-to-hero/02-interactive-conversation-agent test
```

## Hermes mapping

Maps to Hermes CLI flow plus in-memory session messages before persistence is introduced.

## Acceptance criteria

- The CLI accepts multiple turns.
- Assistant output streams when the active provider supports streaming and falls back to full-message output otherwise.
- `/history` shows prior messages.
- `/exit` exits cleanly.
