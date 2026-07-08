import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const projects = [
  "00-minimal-chat-agent",
  "01-real-provider-agent",
  "02-interactive-conversation-agent",
  "03-context-managed-agent",
  "04-tool-using-agent",
  "05-robust-tool-agent",
  "06-workspace-file-agent",
  "07-safe-shell-agent",
  "08-persistent-session-agent",
  "09-memory-snapshot-agent",
  "10-memory-tool-agent",
  "11-memory-governance-agent",
  "12-skills-agent",
  "13-compressed-context-agent",
  "14-scheduled-agent",
  "15-http-gateway-agent",
  "16-delegating-agent",
  "17-hermes-lite-agent"
];

const requiredRootFiles = [
  "README.md",
  "package.json",
  "tsconfig.base.json",
  "docs/00-overview.md",
  "docs/01-setup.md",
  "docs/02-architecture-map.md",
  "docs/03-copy-forward-workflow.md",
  "docs/04-harness.md",
  "scripts/check-structure.mjs",
  "scripts/copy-forward.mjs",
  "templates/project/README.md",
  "templates/project/docs/lesson.md",
  "templates/project/docs/implementation.md",
  "templates/project/package.json",
  "templates/project/tsconfig.json",
  "templates/project/src/index.ts",
  "templates/project/tests/smoke.test.ts"
];

const requiredProjectDocs = [
  "README.md",
  "docs/lesson.md",
  "docs/implementation.md"
];

const implementedProjectFiles = [
  "package.json",
  "tsconfig.json",
  "src/index.ts",
  "src/agent.ts",
  "src/messages.ts",
  "src/provider.ts",
  "tests/smoke.test.ts"
];

const errors = [];

function requireFile(relativePath) {
  if (!existsSync(path.join(root, relativePath))) {
    errors.push(`Missing ${relativePath}`);
  }
}

for (const file of requiredRootFiles) {
  requireFile(file);
}

for (const project of projects) {
  for (const file of requiredProjectDocs) {
    requireFile(path.join("projects", project, file));
  }

  const readmePath = path.join(root, "projects", project, "README.md");
  if (existsSync(readmePath)) {
    const readme = readFileSync(readmePath, "utf8");
    for (const heading of ["## Copy-forward source", "## Implementation focus", "## Acceptance criteria"]) {
      if (!readme.includes(heading)) {
        errors.push(`projects/${project}/README.md missing ${heading}`);
      }
    }
  }
}

for (const file of implementedProjectFiles) {
  requireFile(path.join("projects", "00-minimal-chat-agent", file));
}

if (errors.length > 0) {
  console.error("Structure check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Structure check passed for ${projects.length} project folders.`);

