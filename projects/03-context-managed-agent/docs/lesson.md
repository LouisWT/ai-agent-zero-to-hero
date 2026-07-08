# Lesson

An agent has two histories: everything that happened, and the subset sent to the model. Hermes separates these concerns to control prompt size and keep stable prompt layers cache-friendly.

## What changes in this step

- Full conversation remains available locally.
- Provider calls receive a bounded context.
- System prompt becomes an explicit context layer.

## Key idea

Context building is a policy layer, not just array slicing.

