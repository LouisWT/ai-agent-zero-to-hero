# Implementation guide

## Starting point

```bash
npm run copy-forward -- 01-real-provider-agent 02-interactive-conversation-agent
```

## Steps

1. Rename the package.
2. Add `Conversation`.
3. Replace one-shot CLI handling with `readline/promises`.
4. Add command dispatch for `/help`, `/history`, and `/exit`.
5. Update tests for multi-turn history.

## Done when

You can hold a multi-turn mock conversation and inspect history without sending `/history` to the provider.

