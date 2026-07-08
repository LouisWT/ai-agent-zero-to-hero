# Lesson

Hermes memory is not a full transcript and not arbitrary file access. It is compact curated memory that enters the system prompt as a frozen snapshot.

## What changes in this step

- Long-term facts live outside the session DB.
- `MEMORY.md` and `USER.md` have separate purposes.
- Memory is read at session start and remains stable for that session.

## Key idea

Frozen snapshots preserve prompt stability. Mid-session writes will come later, but they should not mutate the current cached system prompt.

