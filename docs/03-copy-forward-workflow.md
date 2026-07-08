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
- `.env` when present, for local convenience only

It does not overwrite the target project's README or docs. It also does not overwrite an existing target `.env`; local secrets should stay ignored by git and should not be committed.

After copying, follow the target project's `docs/implementation.md`.
