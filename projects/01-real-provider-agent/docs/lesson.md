# Lesson

The first important seam in an agent is the model provider boundary. Hermes can switch providers because the rest of the agent loop talks to a normalized runtime shape.

## What changes in this step

- The agent depends on a provider interface.
- The mock provider remains useful for tests.
- A real OpenAI-compatible provider becomes an optional runtime path.

## Key idea

Provider SDK types should not leak through the agent. Normalize requests and responses at the boundary.

