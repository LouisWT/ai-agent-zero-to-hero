# Implementation guide

## Starting point

```bash
npm run copy-forward -- 10-memory-tool-agent 11-memory-governance-agent
```

## Steps

1. Rename the package.
2. Add threat-pattern scanning.
3. Add snapshot sanitization.
4. Implement atomic writes and drift backup.
5. Add approval staging store and CLI commands.
6. Add `MemoryProvider` interface stub.
7. Test blocked entries, staged writes, approval, and drift handling.

## Done when

Memory writes are durable, inspectable, and reject unsafe or ambiguous changes.

