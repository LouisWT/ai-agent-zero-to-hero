import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { Agent } from "./agent.js";
import { loadEnvFile } from "./env.js";

async function readInput(args: readonly string[]): Promise<string> {
  if (args.length > 0) {
    return args.join(" ");
  }

  if (!stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of stdin) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const piped = Buffer.concat(chunks).toString("utf8").trim();
    if (piped) {
      return piped;
    }
  }

  return "Hello, agent!";
}

export async function main(args = process.argv.slice(2)): Promise<void> {
  loadEnvFile();
  const input = await readInput(args);
  const agent = new Agent();
  const response = await agent.chat(input);
  console.log(response.content);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
