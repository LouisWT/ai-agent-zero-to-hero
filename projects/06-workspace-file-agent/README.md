# 06 - Workspace File Agent

## Goal

Give the agent workspace-scoped file tools without allowing arbitrary filesystem access.

## Copy-forward source

Copy from `05-robust-tool-agent`.

```bash
npm run copy-forward -- 05-robust-tool-agent 06-workspace-file-agent
```

## Implementation focus

- Add workspace root configuration.
- Add `listFiles`, `readFile`, and `writeFile`.
- Normalize paths before access.
- Reject path traversal outside the workspace.
- Update the copied package name to `@ai-agent-zero-to-hero/06-workspace-file-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/06-workspace-file-agent dev
npm run --workspace @ai-agent-zero-to-hero/06-workspace-file-agent test
```

## Hermes mapping

Maps to Hermes file tools and workspace safety boundaries.

## Acceptance criteria

- The agent can read and write files under the workspace.
- `../` traversal is rejected.
- Tests cover path normalization and rejection.

