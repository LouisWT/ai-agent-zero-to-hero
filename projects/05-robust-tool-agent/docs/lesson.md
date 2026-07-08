# Lesson

Tool calls fail often: bad JSON, unknown names, invalid arguments, or runtime failures. A robust agent surfaces those errors without crashing.

## What changes in this step

- Tool results distinguish success from error.
- CLI shows tool events.
- The agent loop can continue after failures.

## Key idea

Tool errors are part of the conversation protocol, not just exceptions.

