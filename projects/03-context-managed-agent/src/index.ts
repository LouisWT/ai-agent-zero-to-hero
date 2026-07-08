import { stdin, stdout } from "node:process";
import { pathToFileURL } from "node:url";
import { Agent } from "./agent.js";
import { writeAssistantReply, runRepl } from "./cli.js";
import { loadEnvFile } from "./env.js";

export async function main(args = process.argv.slice(2)): Promise<void> {
  loadEnvFile();
  const agent = new Agent();

  if (args.length > 0) {
    await writeAssistantReply(agent, args.join(" "), stdout);
    return;
  }

  await runRepl(agent, {
    input: stdin,
    output: stdout
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
