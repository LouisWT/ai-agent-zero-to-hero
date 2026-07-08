# Implementation guide

## Starting point

```bash
npm run copy-forward -- 14-scheduled-agent 15-http-gateway-agent
```

## Steps

1. Rename the package.
2. Add a web server dependency.
3. Add a gateway session router.
4. Implement `POST /chat`.
5. Add tests using server injection or localhost requests.

## Done when

The same agent can be driven through HTTP with session continuity.

