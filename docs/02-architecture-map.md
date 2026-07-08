# Hermes architecture map

This tutorial reimplements Hermes ideas in TypeScript as teaching code.

| Hermes area | Tutorial projects |
| --- | --- |
| `AIAgent.chat()` and conversation loop | `00` to `03` |
| Provider runtime and streaming output | `01` to `02` |
| Prompt/context layer assembly | `03`, extended by `09`, `12`, and `13` |
| Tool registry and dispatch | `04` to `05` |
| File and terminal tools | `06` to `07` |
| SQLite session state/search | `08` |
| `MEMORY.md` / `USER.md` curated memory | `09` to `11` |
| Skills progressive disclosure | `12` |
| Context compression | `13` |
| Cron scheduler | `14` |
| Gateway/API surfaces | `15` |
| Delegation/subagents | `16` |
| Integrated Hermes Lite | `17` |

The tutorial keeps the architecture shape, but avoids copying production Hermes code directly.
