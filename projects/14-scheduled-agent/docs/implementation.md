# Implementation guide

## Starting point

```bash
npm run copy-forward -- 13-compressed-context-agent 14-scheduled-agent
```

## Steps

1. Rename the package.
2. Add job types and `JobStore`.
3. Add `cronjob` tool actions.
4. Add scheduler loop.
5. Add fresh-agent job execution.
6. Test create/list/cancel and due job detection.

## Done when

A scheduled prompt can be saved, picked up, and executed outside the foreground turn.

