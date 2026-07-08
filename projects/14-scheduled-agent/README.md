# 14 - Scheduled Agent

## Goal

Let the agent create and execute scheduled prompts.

## Copy-forward source

Copy from `13-compressed-context-agent`.

```bash
npm run copy-forward -- 13-compressed-context-agent 14-scheduled-agent
```

## Implementation focus

- Add `JobStore`.
- Persist jobs in JSON or SQLite.
- Add `cronjob.create`, `cronjob.list`, and `cronjob.cancel`.
- Add a scheduler loop with `setInterval`.
- Run due jobs with a fresh agent instance.
- Update the copied package name to `@ai-agent-zero-to-hero/14-scheduled-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/14-scheduled-agent dev
npm run --workspace @ai-agent-zero-to-hero/14-scheduled-agent test
```

## Hermes mapping

Maps to Hermes `cron/` internals in a small local scheduler.

## Acceptance criteria

- The agent can create, list, and cancel jobs.
- Due jobs are detected by the scheduler.
- Job execution uses a fresh agent context.

