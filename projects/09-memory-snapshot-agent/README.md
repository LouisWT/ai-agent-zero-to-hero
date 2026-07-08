# 09 - Memory Snapshot Agent

## Goal

Add the first Hermes-style memory layer: bounded curated memory loaded at session start and injected as a frozen system prompt snapshot.

## Copy-forward source

Copy from `08-persistent-session-agent`.

```bash
npm run copy-forward -- 08-persistent-session-agent 09-memory-snapshot-agent
```

## Implementation focus

- Add `MemoryStore`.
- Add `MEMORY.md` and `USER.md` stores.
- Split entries with the `§` delimiter.
- Track character budgets.
- Inject frozen memory blocks into system prompt at session start.
- Add `/memory show`.
- Update the copied package name to `@ai-agent-zero-to-hero/09-memory-snapshot-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/09-memory-snapshot-agent dev
npm run --workspace @ai-agent-zero-to-hero/09-memory-snapshot-agent test
```

## Hermes mapping

Maps to `MemoryStore.load_from_disk()`, `format_for_system_prompt()`, and memory injection in `agent/system_prompt.py`.

## Acceptance criteria

- Memory files are parsed into bounded entries.
- The provider context includes a frozen memory snapshot.
- `/memory show` displays the snapshot captured at startup.

