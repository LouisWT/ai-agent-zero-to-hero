# Lesson

An agent has two histories: everything that happened, and the subset sent to the model. Hermes separates these concerns to control prompt size and keep stable prompt layers cache-friendly.

Prompt management should be a first-class subsystem. The agent should not build prompts by appending strings in the CLI, tools, memory store, and provider code. Instead, each source contributes a named layer, and one context builder decides ordering, budgeting, and inspection.

## What changes in this step

- Full conversation remains available locally.
- Provider calls receive a bounded context.
- System prompt becomes an explicit context layer.
- Prompt sources become explicit layers that later projects can extend: base instructions, runtime policy, memory snapshots, loaded skills, summaries, and recent messages.

## Key idea

Context building is a policy layer, not just array slicing. Centralizing prompt assembly keeps future features from creating hidden prompt fragments that are hard to inspect, test, or compress.
