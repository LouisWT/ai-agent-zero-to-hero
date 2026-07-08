# Lesson

Scheduled jobs make an agent proactive. Hermes creates fresh agents for due jobs so scheduled work does not accidentally reuse the wrong foreground state.

## What changes in this step

- Jobs become persistent state.
- A background scheduler scans for due work.
- Job execution creates its own agent context.

## Key idea

Scheduled execution should be isolated from the active chat session.

