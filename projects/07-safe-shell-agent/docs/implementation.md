# Implementation guide

## Starting point

```bash
npm run copy-forward -- 06-workspace-file-agent 07-safe-shell-agent
```

## Steps

1. Rename the package.
2. Add a shell runner around `child_process`.
3. Add a denylist and timeout.
4. Register `runShell`.
5. Test success, non-zero exit, timeout, and rejected command cases.

## Done when

The agent can run harmless commands and refuses clearly dangerous ones.

