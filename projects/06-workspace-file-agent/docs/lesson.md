# Lesson

Local file access is powerful and risky. This step teaches the agent to work inside a bounded workspace.

## What changes in this step

- Tools touch the filesystem.
- All paths are resolved relative to a workspace root.
- Unsafe paths are rejected before I/O.

## Key idea

Never trust model-provided paths without normalization and boundary checks.

