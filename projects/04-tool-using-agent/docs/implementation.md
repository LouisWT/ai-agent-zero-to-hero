# Implementation guide

## Starting point

```bash
npm run copy-forward -- 03-context-managed-agent 04-tool-using-agent
```

## Steps

1. Rename the package.
2. Add tool types and registry.
3. Add safe example tools.
4. Extend provider response type with tool calls.
5. Add a tool loop in `Agent.chat`.
6. Test successful tool execution.

## Done when

Asking a time or calculation question triggers a tool event and final answer.

