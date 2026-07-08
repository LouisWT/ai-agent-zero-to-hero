# 01 - Real Provider Agent

## Goal

Upgrade the minimal mock agent so the same `Agent` can run against either a mock provider or an OpenAI-compatible model provider.

## Copy-forward source

Copy from `00-minimal-chat-agent`.

```bash
npm run copy-forward -- 00-minimal-chat-agent 01-real-provider-agent
```

## Implementation focus

- Add a provider runtime boundary instead of hard-coding `MockProvider`.
- Add `OpenAICompatibleProvider`.
- Read `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` from the environment.
- Keep mock provider as the default for tests.
- Update the copied package name to `@ai-agent-zero-to-hero/01-real-provider-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/01-real-provider-agent dev -- "hello"
npm run --workspace @ai-agent-zero-to-hero/01-real-provider-agent test
```

## Hermes mapping

Maps to Hermes provider runtime resolution in `hermes_cli/runtime_provider.py`, simplified to one OpenAI-compatible path.

## Acceptance criteria

- Mock mode still runs without credentials.
- Real provider mode can be selected with environment variables.
- Tests do not require a network call.

