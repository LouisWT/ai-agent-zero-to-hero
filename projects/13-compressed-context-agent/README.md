# 13 - Compressed Context Agent

## Goal

Teach the agent to keep long-running conversations usable by summarizing older context while preserving recent messages, memory, and skills.

## Copy-forward source

Copy from `12-skills-agent`.

```bash
npm run copy-forward -- 12-skills-agent 13-compressed-context-agent
```

## Implementation focus

- Add a context budget.
- Summarize older messages.
- Preserve recent messages.
- Preserve Hermes-style memory snapshot.
- Preserve loaded skills.
- Refresh frozen memory snapshot after prompt invalidation when appropriate.
- Update the copied package name to `@ai-agent-zero-to-hero/13-compressed-context-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/13-compressed-context-agent dev
npm run --workspace @ai-agent-zero-to-hero/13-compressed-context-agent test
```

## Hermes mapping

Maps to Hermes context compression and prompt invalidation behavior.

## Acceptance criteria

- Long histories are summarized under budget.
- Recent messages remain intact.
- Memory and loaded skills are not accidentally dropped.

