# Harness

The harness keeps the course usable while only some projects are implemented.

## Scripts

- `npm run check:structure` checks that all project folders and docs exist.
- `npm run copy-forward -- <from> <to>` copies code from one project to the next.
- `npm run test:implemented` runs tests only for projects that already have a `package.json`.

## Why scaffold-first

The course has 18 projects. Implementing them all up front would make the repository hard to learn from. Instead, the first pass creates a guided map and one runnable reference project. Each later project becomes runnable when you copy forward and implement that lesson.

