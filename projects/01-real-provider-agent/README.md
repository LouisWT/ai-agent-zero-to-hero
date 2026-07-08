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
- Read `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`, and optional `OPENAI_API_VERSION` from the environment.
- Keep mock provider as the default for tests.
- Update the copied package name to `@ai-agent-zero-to-hero/01-real-provider-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/01-real-provider-agent dev -- "hello"
npm run --workspace @ai-agent-zero-to-hero/01-real-provider-agent test
```

## Using other provider APIs

Start by checking whether the provider exposes an OpenAI-compatible chat completions API.

If it does, you usually only need environment configuration:

```bash
OPENAI_API_KEY=<provider-api-key>
OPENAI_BASE_URL=<provider-openai-compatible-base-url>
OPENAI_MODEL=<provider-model-or-deployment-name>
```

This is the expected path for OpenAI-compatible endpoints from providers such as DeepSeek, GLM, Kimi, or an OpenAI-compatible gateway. Azure Foundry project endpoints and Azure deployment endpoints are also handled by the provider boundary in this lesson.

If the provider does not expose OpenAI-compatible requests and responses, do not push provider-specific logic into `Agent`. Add a new provider class that implements the same `Provider.generate()` contract, then select it from the provider factory. For example, an Anthropic Claude direct API integration would use its own `AnthropicProvider` because its request path, headers, system prompt handling, and response shape differ from OpenAI chat completions.

## Hermes mapping

Maps to Hermes provider runtime resolution in `hermes_cli/runtime_provider.py`, simplified to one OpenAI-compatible path.

## Acceptance criteria

- Mock mode still runs without credentials.
- Real provider mode can be selected with environment variables.
- Tests do not require a network call.
