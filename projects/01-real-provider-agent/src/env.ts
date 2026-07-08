import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export interface EnvTarget {
  [key: string]: string | undefined;
}

export function loadEnvFile(filePath = path.join(process.cwd(), ".env"), env: EnvTarget = process.env): void {
  if (!existsSync(filePath)) {
    return;
  }

  const contents = readFileSync(filePath, "utf8");
  const lines = contents.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) {
      throw new Error(`Invalid .env line ${index + 1}: ${line}`);
    }

    const [, key, rawValue] = match;
    if (env[key] !== undefined) {
      continue;
    }

    env[key] = parseEnvValue(rawValue);
  }
}

function parseEnvValue(rawValue: string): string {
  let value = rawValue.trim();
  const quote = value[0];

  if ((quote === "\"" || quote === "'") && value.endsWith(quote)) {
    return value.slice(1, -1);
  }

  const commentIndex = value.search(/\s#/);
  if (commentIndex >= 0) {
    value = value.slice(0, commentIndex).trim();
  }

  return value;
}
