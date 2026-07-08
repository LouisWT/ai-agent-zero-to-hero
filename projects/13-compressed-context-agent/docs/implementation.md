# Implementation guide

## Starting point

```bash
npm run copy-forward -- 12-skills-agent 13-compressed-context-agent
```

## Steps

1. Rename the package.
2. Add context budget accounting.
3. Add a summarizer interface with a mock summarizer for tests.
4. Store summary messages.
5. Keep recent messages, memory snapshot, and loaded skills.
6. Add tests for long-history compression.

## Done when

The agent can continue a long session without losing the newest user request or curated memory.

