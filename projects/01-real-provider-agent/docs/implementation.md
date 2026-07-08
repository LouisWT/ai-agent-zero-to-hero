# Implementation guide

## Starting point

```bash
npm run copy-forward -- 00-minimal-chat-agent 01-real-provider-agent
```

## Steps

1. Rename the copied package to `@ai-agent-zero-to-hero/01-real-provider-agent`.
2. Expand the provider interface to accept model request options.
3. Add an `OpenAICompatibleProvider`.
4. Add a provider factory that selects mock or real provider.
5. Add `.env.example`.
6. Keep tests on `MockProvider`.

## Done when

The project can run with mock mode by default and with a real model when env vars are configured.

