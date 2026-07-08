# AI Agent Zero to Hero

TypeScript/Node-first tutorial for building a Hermes-like AI agent one capability at a time.

This repository is scaffold-first: the initial version provides the course map, harness, reusable project template, and a runnable `00-minimal-chat-agent`. Later lessons are prepared as project folders with README/docs so you can copy the previous project forward and implement each capability with Copilot step by step.

## Learning path

| Project | Capability |
| --- | --- |
| `00-minimal-chat-agent` | Minimal runnable chat agent with `Message`, `Agent`, and `MockProvider`. |
| `01-real-provider-agent` | Add provider runtime and OpenAI-compatible model support. |
| `02-interactive-conversation-agent` | Add interactive REPL and conversation history. |
| `03-context-managed-agent` | Add context builder, system prompt layering, and context budget. |
| `04-tool-using-agent` | Add first tool schemas, registry, validation, and tool loop. |
| `05-robust-tool-agent` | Add structured tool errors and visible tool events. |
| `06-workspace-file-agent` | Add workspace-scoped file tools. |
| `07-safe-shell-agent` | Add safe shell execution. |
| `08-persistent-session-agent` | Add SQLite session persistence and search. |
| `09-memory-snapshot-agent` | Add Hermes-style memory snapshot injection. |
| `10-memory-tool-agent` | Add Hermes-style `memory` tool. |
| `11-memory-governance-agent` | Add memory security, approval, and provider extension points. |
| `12-skills-agent` | Add skill discovery and on-demand loading. |
| `13-compressed-context-agent` | Add context compression. |
| `14-scheduled-agent` | Add scheduled jobs. |
| `15-http-gateway-agent` | Add HTTP gateway. |
| `16-delegating-agent` | Add child-task delegation. |
| `17-hermes-lite-agent` | Integrate the final Hermes Lite agent. |

## Quick start

```bash
npm install
npm run check:structure
npm run test:implemented
npm run --workspace @ai-agent-zero-to-hero/00-minimal-chat-agent dev -- "hello agent"
```

## Workflow

1. Read a project README and its `docs/lesson.md`.
2. Run `npm run copy-forward -- <previous-project> <current-project>`.
3. Follow `docs/implementation.md`.
4. Run the project test and demo commands.
5. Move to the next project.

See `docs/03-copy-forward-workflow.md` for details.

