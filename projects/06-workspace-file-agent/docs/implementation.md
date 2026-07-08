# Implementation guide

## Starting point

```bash
npm run copy-forward -- 05-robust-tool-agent 06-workspace-file-agent
```

## Steps

1. Rename the package.
2. Add workspace configuration.
3. Add file tool implementations.
4. Register the tools.
5. Add tests with a temporary workspace.

## Done when

File tools work inside the workspace and fail safely outside it.

