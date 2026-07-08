# 10 - Memory Tool Agent

## Goal

Let the agent manage curated memory through a Hermes-style single `memory` tool.

## Copy-forward source

Copy from `09-memory-snapshot-agent`.

```bash
npm run copy-forward -- 09-memory-snapshot-agent 10-memory-tool-agent
```

## Implementation focus

- Add one `memory` tool with `target: memory | user`.
- Support `add`, `replace`, and `remove`.
- Support atomic batch `operations`.
- Use short unique `oldText` substring matching for replace/remove.
- Reject duplicates.
- Return `currentEntries` and `usage` when over budget.
- Do not update the current frozen snapshot after a successful write.
- Update the copied package name to `@ai-agent-zero-to-hero/10-memory-tool-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/10-memory-tool-agent dev
npm run --workspace @ai-agent-zero-to-hero/10-memory-tool-agent test
```

## Hermes mapping

Maps to `tools/memory_tool.py`, especially `memory_tool()`, `MEMORY_SCHEMA`, and `apply_batch()`.

## Acceptance criteria

- The model can add, replace, remove, and batch memory entries.
- Over-budget writes produce consolidation guidance.
- Successful writes are durable but do not change the active snapshot.

