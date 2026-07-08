# Implementation guide

## Starting point

```bash
npm run copy-forward -- 02-interactive-conversation-agent 03-context-managed-agent
```

## Steps

1. Rename the package.
2. Add `ContextBuilder`.
3. Route provider calls through the builder.
4. Add `/context`.
5. Add tests for trimming and system prompt retention.

## Done when

The agent can explain its current provider context and keep it under budget.

