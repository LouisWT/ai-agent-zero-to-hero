# 08 - Persistent Session Agent

## Goal

Persist conversations so sessions can be resumed and searched after the CLI exits.

## Copy-forward source

Copy from `07-safe-shell-agent`.

```bash
npm run copy-forward -- 07-safe-shell-agent 08-persistent-session-agent
```

## Implementation focus

- Add `SessionStore`.
- Add SQLite tables for `sessions` and `messages`.
- Persist every turn.
- Add `/sessions`, `/resume <id>`, and `/search <query>`.
- Update the copied package name to `@ai-agent-zero-to-hero/08-persistent-session-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/08-persistent-session-agent dev
npm run --workspace @ai-agent-zero-to-hero/08-persistent-session-agent test
```

## Hermes mapping

Maps to the teaching subset of `hermes_state.py`: durable sessions, message storage, and search.

## Acceptance criteria

- New messages are stored in SQLite.
- A prior session can be resumed.
- Search returns matching stored messages.

