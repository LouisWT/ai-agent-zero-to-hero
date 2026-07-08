# Copy-forward workflow

Most projects start by copying the previous implemented project, then making one meaningful capability upgrade.

```bash
npm run copy-forward -- 00-minimal-chat-agent 01-real-provider-agent
```

The source project must already be implemented. Early scaffold-only folders contain only README/docs, so they are not valid copy sources until you complete that lesson.

The copy script copies executable harness files such as:

- `package.json`
- `tsconfig.json`
- `src/`
- `tests/`
- `.env.example` when present

It does not overwrite the target project's README or docs.

After copying, follow the target project's `docs/implementation.md`.
