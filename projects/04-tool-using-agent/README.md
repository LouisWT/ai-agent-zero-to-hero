# 04 - Tool Using Agent

## Goal

Let the agent call simple tools and use tool results to produce a final answer.

## Copy-forward source

Copy from `03-context-managed-agent`.

```bash
npm run copy-forward -- 03-context-managed-agent 04-tool-using-agent
```

## Implementation focus

- Add `ToolDefinition`, `ToolCall`, and `ToolResult`.
- Add `ToolRegistry`.
- Add argument validation.
- Add `getCurrentTime` and `calculator`.
- Extend mock provider to simulate tool calls.
- Update the copied package name to `@ai-agent-zero-to-hero/04-tool-using-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/04-tool-using-agent dev
npm run --workspace @ai-agent-zero-to-hero/04-tool-using-agent test
```

## Hermes mapping

Maps to `model_tools.py`, `tools/registry.py`, and the first form of the Hermes tool loop.

## Acceptance criteria

- Tool calls are executed by the agent, not the provider.
- Final response can include tool results.
- Tests cover at least one successful tool call.

