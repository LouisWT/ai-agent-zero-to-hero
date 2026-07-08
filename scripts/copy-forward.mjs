import { existsSync, cpSync, mkdirSync } from "node:fs";
import path from "node:path";

const [, , fromArg, toArg] = process.argv;

if (!fromArg || !toArg) {
  console.error("Usage: npm run copy-forward -- <from-project> <to-project>");
  process.exit(1);
}

const root = process.cwd();
const projectsRoot = path.join(root, "projects");

function resolveProject(value) {
  const cleaned = value.replace(/^projects\//, "").replace(/\/$/, "");
  if (!cleaned || cleaned.includes("..") || path.isAbsolute(cleaned) || cleaned.includes("/")) {
    console.error(`Invalid project slug: ${value}`);
    process.exit(1);
  }

  const resolved = path.resolve(projectsRoot, cleaned);
  const relative = path.relative(projectsRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    console.error(`Project slug escapes projects directory: ${value}`);
    process.exit(1);
  }

  return resolved;
}

const fromDir = resolveProject(fromArg);
const toDir = resolveProject(toArg);

if (!existsSync(fromDir)) {
  console.error(`Source project does not exist: ${fromDir}`);
  process.exit(1);
}

if (!existsSync(toDir)) {
  console.error(`Target project does not exist: ${toDir}`);
  process.exit(1);
}

if (fromDir === toDir) {
  console.error("Source and target projects must be different.");
  process.exit(1);
}

const requiredItems = ["package.json", "tsconfig.json", "src", "tests"];
const optionalItems = [".env.example"];
const missingRequiredItems = requiredItems.filter((item) => !existsSync(path.join(fromDir, item)));

if (missingRequiredItems.length > 0) {
  console.error(
    `Source project is not implemented yet; missing required item(s): ${missingRequiredItems.join(", ")}`
  );
  process.exit(1);
}

for (const item of [...requiredItems, ...optionalItems]) {
  const source = path.join(fromDir, item);
  const target = path.join(toDir, item);
  if (!existsSync(source)) {
    continue;
  }
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true, force: true });
  console.log(`Copied ${path.relative(root, source)} -> ${path.relative(root, target)}`);
}

console.log("Copy-forward complete. README.md and docs/ were left untouched.");
