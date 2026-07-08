# Implementation guide

## Starting point

```bash
npm run copy-forward -- 08-persistent-session-agent 09-memory-snapshot-agent
```

## Steps

1. Rename the package.
2. Add `MemoryStore`.
3. Parse `MEMORY.md` and `USER.md` with `§` delimiters.
4. Render memory blocks with usage headers.
5. Inject blocks through `ContextBuilder`.
6. Add `/memory show`.
7. Test frozen snapshot behavior.

## Done when

Manual memory file edits appear after a new session starts, not by mutating the active snapshot.

