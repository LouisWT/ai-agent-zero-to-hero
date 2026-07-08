# Implementation guide

## Starting point

```bash
npm run copy-forward -- 01-real-provider-agent 02-interactive-conversation-agent
```

## Steps

1. Rename the package.
2. Add `Conversation`.
3. Add an optional provider `stream()` path with a `generate()` fallback.
4. Replace one-shot CLI handling with `readline/promises` and render streamed assistant chunks when available.
5. Add command dispatch for `/help`, `/history`, and `/exit`.
6. Update tests for multi-turn history and streaming fallback behavior.

## Done when

You can hold a multi-turn mock conversation, stream assistant output when supported, and inspect history without sending `/history` to the provider.
