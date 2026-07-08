# 17 - Hermes Lite Agent

## Goal

Integrate the tutorial capabilities into a coherent Hermes-like TypeScript agent.

## Copy-forward source

Copy from `16-delegating-agent`.

```bash
npm run copy-forward -- 16-delegating-agent 17-hermes-lite-agent
```

## Implementation focus

- Clean up module boundaries.
- Keep provider runtime configurable.
- Keep robust tool runtime.
- Keep session DB and search.
- Keep Hermes-style memory snapshot/tool/governance.
- Keep skills, compression, scheduler, gateway, and delegation.
- Add an end-to-end demo.
- Update the copied package name to `@ai-agent-zero-to-hero/17-hermes-lite-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/17-hermes-lite-agent dev
npm run --workspace @ai-agent-zero-to-hero/17-hermes-lite-agent test
```

## Hermes mapping

Maps to the overall Hermes architecture while staying intentionally smaller than the production project.

## Acceptance criteria

- The integrated agent has a documented demo path.
- Core modules have clear boundaries.
- Smoke tests cover conversation, tools, persistence, memory, and gateway behavior.

