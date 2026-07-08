# Implementation guide

## Starting point

```bash
npm run copy-forward -- 09-memory-snapshot-agent 10-memory-tool-agent
```

## Steps

1. Rename the package.
2. Define the `memory` tool schema.
3. Implement single operations.
4. Implement atomic batch operations.
5. Enforce final character budget.
6. Ensure successful writes do not mutate the current snapshot.
7. Add tests for add, replace, remove, batch, duplicate, and overflow cases.

## Done when

The agent can save a user preference for the next session without destabilizing the current prompt.

