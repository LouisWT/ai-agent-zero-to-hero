# Lesson

Hermes has no `memory.read` action. The model reads memory because it was injected into the system prompt. The tool exists to curate future memory.

## What changes in this step

- Memory becomes writable by the agent.
- Writes remain bounded and curated.
- Batch operations allow consolidation and additions in one call.

## Key idea

Memory writes are durable side effects for future turns or sessions, not a way to fetch arbitrary context.

