# Implementation guide

## Starting point

```bash
npm run copy-forward -- 02-interactive-conversation-agent 03-context-managed-agent
```

## Steps

1. Rename the package.
2. Add a `PromptLayer` or equivalent context-layer representation with a name, messages/content, ordering, and budget behavior.
3. Add `ContextBuilder` as the only place that turns prompt layers plus conversation history into provider messages.
4. Route provider calls through the builder.
5. Add `/context` so users can inspect the assembled layers and final provider context.
6. Add tests for layer ordering, trimming, and system prompt retention.

## Prompt management policy

Treat prompt content as managed inputs, not ad hoc strings. The initial layer set should be small but explicit:

- Base system instructions: stable behavior and role.
- Runtime policy: local CLI/runtime constraints.
- Recent conversation: the newest user and assistant messages under budget.

Later projects should add memory snapshots, loaded skills, tool instructions, and compressed summaries by registering layers with `ContextBuilder`. They should not concatenate extra prompt text inside `Agent`, provider classes, command handlers, or tool implementations.

## Done when

The agent can explain its current provider context, show where each prompt layer came from, and keep the final provider input under budget.
