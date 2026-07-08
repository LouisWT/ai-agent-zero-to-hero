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
6. Document how OpenAI-compatible providers can be configured and how non-compatible providers should be added behind the same provider boundary.
7. Keep tests on `MockProvider` or fake fetches so tests never require network access.

## Connecting other APIs

The lesson's default real provider is `OpenAICompatibleProvider`. Use it for any provider that accepts OpenAI-style chat completion requests and returns OpenAI-style choices:

```bash
OPENAI_API_KEY=<provider-api-key>
OPENAI_BASE_URL=<provider-openai-compatible-base-url>
OPENAI_MODEL=<provider-model-or-deployment-name>
```

Use this path for compatible endpoints such as DeepSeek, GLM, Kimi, or provider gateways that intentionally mimic OpenAI chat completions. Azure variants may need endpoint-specific handling, such as deployment URLs or Foundry project URLs, but that logic should stay inside the provider layer.

For APIs that are not OpenAI-compatible, add a separate provider implementation instead of changing `Agent`:

1. Implement `Provider.generate(request)` in a new class such as `AnthropicProvider`.
2. Translate the normalized `ProviderRequest` into that vendor's request shape.
3. Translate the vendor response back into the local `Message` shape.
4. Add environment variables and provider selection in the factory.
5. Cover the integration with fake HTTP responses rather than live network tests.

This keeps the lesson's main design point intact: the agent talks to a normalized provider boundary, while vendor-specific details stay at the edge.

## Done when

The project can run with mock mode by default and with a real model when env vars are configured.
