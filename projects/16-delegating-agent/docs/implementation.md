# Implementation guide

## Starting point

```bash
npm run copy-forward -- 15-http-gateway-agent 16-delegating-agent
```

## Steps

1. Rename the package.
2. Add child-agent creation.
3. Define child tool restrictions.
4. Add bounded parallel execution.
5. Add aggregation into parent response.
6. Test isolation, limits, and aggregation.

## Done when

The parent agent can delegate safe subquestions and use the child results.

