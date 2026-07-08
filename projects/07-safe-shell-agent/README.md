# 07 - Safe Shell Agent

## Goal

Add a shell tool that can run safe commands inside the workspace with timeouts and structured output.

## Copy-forward source

Copy from `06-workspace-file-agent`.

```bash
npm run copy-forward -- 06-workspace-file-agent 07-safe-shell-agent
```

## Implementation focus

- Add `runShell`.
- Fix command cwd to the workspace.
- Add timeout handling.
- Return `stdout`, `stderr`, and `exitCode`.
- Reject dangerous commands such as `rm -rf`, `sudo`, and sensitive path redirects.
- Update the copied package name to `@ai-agent-zero-to-hero/07-safe-shell-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/07-safe-shell-agent dev
npm run --workspace @ai-agent-zero-to-hero/07-safe-shell-agent test
```

## Hermes mapping

Maps to Hermes terminal tooling and approval/safety boundaries in a local-only teaching form.

## Acceptance criteria

- Safe commands execute in the workspace.
- Dangerous commands are rejected before execution.
- Timeout behavior is tested.

