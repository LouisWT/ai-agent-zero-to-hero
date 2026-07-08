# Implementation guide

## Starting point

```bash
npm run copy-forward -- 04-tool-using-agent 05-robust-tool-agent
```

## Steps

1. Rename the package.
2. Add `ToolEvent`.
3. Wrap registry execution with structured error handling.
4. Print events in the CLI.
5. Add failure-mode tests.

## Done when

Bad tool calls are visible, structured, and non-fatal.

