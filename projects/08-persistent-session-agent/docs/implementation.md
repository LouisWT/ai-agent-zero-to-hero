# Implementation guide

## Starting point

```bash
npm run copy-forward -- 07-safe-shell-agent 08-persistent-session-agent
```

## Steps

1. Rename the package.
2. Choose a SQLite package.
3. Create `SessionStore`.
4. Persist user, assistant, and tool messages.
5. Add `/sessions`, `/resume`, and `/search`.
6. Add tests with a temporary database.

## Done when

You can exit, restart, list sessions, resume one, and search prior messages.

