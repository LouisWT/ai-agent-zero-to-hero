# Lesson

Memory enters the system prompt, so corrupted memory is dangerous. Hermes treats memory as a governed subsystem with scanning, stable snapshots, and approval options.

## What changes in this step

- Memory writes are checked before persistence.
- Snapshot injection can block dangerous entries.
- Users can require approval before memory changes land.
- External memory providers get a future extension seam.

## Key idea

Persistent memory is high leverage and high risk. It needs stricter rules than ordinary notes.

