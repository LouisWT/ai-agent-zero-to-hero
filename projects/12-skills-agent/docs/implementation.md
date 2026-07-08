# Implementation guide

## Starting point

```bash
npm run copy-forward -- 11-memory-governance-agent 12-skills-agent
```

## Steps

1. Rename the package.
2. Create a sample skill.
3. Implement `SkillIndex`.
4. Match skills against user input.
5. Load matched `SKILL.md` into context.
6. Add tests for discovery and loading.

## Done when

The agent can load a relevant procedure only when the user asks for a matching task.

