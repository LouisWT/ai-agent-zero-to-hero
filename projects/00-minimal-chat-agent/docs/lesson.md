# Lesson

An agent needs three pieces before it can become more capable:

- a message format,
- an object that owns the interaction,
- and a provider that generates replies.

This project keeps the provider fake so the harness is deterministic. Later projects replace the mock provider with real model calls without changing the basic `Agent.chat()` shape.

## What changes in this step

- New capability: one-shot chat through a CLI.
- Why it matters: every later project starts from this runnable baseline.
- Hermes mapping: this is the smallest teaching version of `AIAgent.chat()`.

