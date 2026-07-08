# 12 - Skills Agent

## Goal

Add procedural memory through skills that are discovered cheaply and loaded only when relevant.

## Copy-forward source

Copy from `11-memory-governance-agent`.

```bash
npm run copy-forward -- 11-memory-governance-agent 12-skills-agent
```

## Implementation focus

- Add `skills/<name>/skill.json`.
- Add `skills/<name>/SKILL.md`.
- Build a `SkillIndex`.
- Match skills by triggers and description.
- Inject only matched skill content into context.
- Update the copied package name to `@ai-agent-zero-to-hero/12-skills-agent`.

## Commands

```bash
npm run --workspace @ai-agent-zero-to-hero/12-skills-agent dev
npm run --workspace @ai-agent-zero-to-hero/12-skills-agent test
```

## Hermes mapping

Maps to Hermes skills and progressive disclosure.

## Acceptance criteria

- The agent can list available skills.
- Relevant skills are loaded for matching user requests.
- The CLI shows which skills were loaded.

