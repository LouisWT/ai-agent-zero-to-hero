# Agent Guide

This repository is a TypeScript/Node tutorial for building an AI agent one capability at a time. Work lesson-by-lesson and keep each project runnable before moving forward.

## Repository shape

- `projects/00-minimal-chat-agent` is the first implemented reference project.
- Later `projects/*` folders may start as scaffolds with only `README.md` and `docs/`.
- Each implemented project should own its local `package.json`, `tsconfig.json`, `src/`, and `tests/`.
- Shared course documentation lives in `docs/`.
- Reusable starter files live in `templates/project`.

## Lesson workflow

1. Read the target project's `README.md`, `docs/lesson.md`, and `docs/implementation.md`.
2. If the target project is scaffold-only, copy the previous implemented project forward:

   ```bash
   npm run copy-forward -- <previous-project> <target-project>
   ```

3. Rename the copied package to `@ai-agent-zero-to-hero/<target-project>`.
4. Implement only the capability for the current lesson.
5. Keep tests deterministic. Use mock providers unless a lesson explicitly requires real runtime integration.
6. Update docs only when the behavior or commands for that lesson change.

## Commands

Install dependencies:

```bash
npm install
```

Validate repository structure:

```bash
npm run check:structure
```

Run tests for implemented projects:

```bash
npm run test:implemented
```

Run type checks for implemented projects:

```bash
npm run typecheck:implemented
```

Run the full default check:

```bash
npm test
```

Run a specific lesson workspace:

```bash
npm run --workspace @ai-agent-zero-to-hero/00-minimal-chat-agent dev -- "hello agent"
npm run --workspace @ai-agent-zero-to-hero/00-minimal-chat-agent test
npm run --workspace @ai-agent-zero-to-hero/00-minimal-chat-agent typecheck
```

## Development guidance

- Preserve the copy-forward teaching model: one meaningful capability per project.
- Do not make scaffold-only future lessons look implemented until their lesson work is complete.
- Keep provider boundaries normalized so SDK-specific details do not leak into `Agent`.
- Avoid network calls in tests.
- Prefer small, readable TypeScript modules over framework-heavy abstractions.
- Use Node.js 20 or newer.
