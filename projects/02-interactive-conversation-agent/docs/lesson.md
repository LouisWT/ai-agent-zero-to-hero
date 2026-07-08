# Lesson

Agents become useful when a conversation has continuity. This step adds a message history that the agent can carry across turns during a single process.

## What changes in this step

- User input is handled in a REPL.
- Message history becomes explicit.
- Provider streaming becomes an optional capability so the CLI can display partial assistant output as it arrives.
- Commands begin to form a CLI control surface.

## Key idea

Do not mix CLI control commands with messages sent to the model, and keep streamed chunks as transport events until the final assistant message is ready to store.
