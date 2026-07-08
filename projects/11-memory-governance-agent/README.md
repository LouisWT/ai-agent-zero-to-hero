# 11 - Memory Governance Agent

## Goal

Make memory safer and closer to Hermes by adding security scanning, atomic writes, approval flow, and a memory provider extension seam.

## Copy-forward source

Copy from `10-memory-tool-agent`.

```bash
npm run copy-forward -- 10-memory-tool-agent 11-memory-governance-agent
```

## Implementation focus

- Scan memory writes for basic prompt-injection/exfiltration patterns.
- Sanitize dangerous entries when building the snapshot.
- Add file lock and atomic write behavior.
- Detect external drift before replace/remove and create `.bak` backups.
- Add write approval commands: `/memory pending`, `/memory approve`, `/memory reject`.
- Add a `MemoryProvider` interface stub.
- Update the copied package name to `@ai-agent-zero-to-hero/11-memory-governance-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/11-memory-governance-agent dev
npm run --workspace @ai-agent-zero-to-hero/11-memory-governance-agent test
```

## Hermes mapping

Maps to Hermes memory threat scanning, drift guard, write approval, and `agent/memory_provider.py`.

## Acceptance criteria

- Suspicious memory entries are blocked or sanitized.
- Replace/remove refuses unsafe drift instead of clobbering files.
- Approval mode stages writes until approved.

