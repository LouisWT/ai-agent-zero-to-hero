# 16 - Delegating Agent

## Goal

Add bounded subtask delegation so the parent agent can split read-only work across child conversations.

## Copy-forward source

Copy from `15-http-gateway-agent`.

```bash
npm run copy-forward -- 15-http-gateway-agent 16-delegating-agent
```

## Implementation focus

- Add `delegateTask`.
- Create isolated child conversations.
- Restrict child tools to safe read-only tools.
- Allow bounded parallel tasks.
- Aggregate child results into the parent response.
- Prevent recursive delegation loops.
- Update the copied package name to `@ai-agent-zero-to-hero/16-delegating-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/16-delegating-agent dev
npm run --workspace @ai-agent-zero-to-hero/16-delegating-agent test
```

## Hermes mapping

Maps to Hermes `delegate_task` and subagent orchestration in a teaching-safe subset.

## Acceptance criteria

- A parent task can spawn bounded child tasks.
- Child contexts are isolated.
- Results are summarized back to the parent.

