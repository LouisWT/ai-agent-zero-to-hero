# 05 - Robust Tool Agent

## Goal

Make tool execution diagnosable and resilient when the model requests invalid or failing tools.

## Copy-forward source

Copy from `04-tool-using-agent`.

```bash
npm run copy-forward -- 04-tool-using-agent 05-robust-tool-agent
```

## Implementation focus

- Represent tool events explicitly.
- Handle unknown tools.
- Handle validation failures.
- Handle thrown tool errors.
- Keep the agent alive after tool failures.
- Update the copied package name to `@ai-agent-zero-to-hero/05-robust-tool-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/05-robust-tool-agent dev
npm run --workspace @ai-agent-zero-to-hero/05-robust-tool-agent test
```

## Hermes mapping

Maps to Hermes registry dispatch error wrapping and visible tool execution events.

## Acceptance criteria

- Invalid tool calls return structured errors.
- Tool errors appear in CLI output.
- Tests cover unknown tool, validation failure, and handler failure.

