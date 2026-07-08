import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import type { Agent } from "./agent.js";
import { formatConversationHistory } from "./conversation.js";
import { formatBuiltContext } from "./context.js";
import type { Message } from "./messages.js";

export interface ReplIO {
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
}

export type CommandResult = "continue" | "exit";

export async function runRepl(agent: Agent, io: ReplIO = {}): Promise<void> {
  const input = io.input ?? stdin;
  const output = io.output ?? stdout;
  const readline = createInterface({
    input,
    output
  });

  output.write("Interactive agent. Type /help for commands or /exit to quit.\n");
  readline.setPrompt("> ");
  readline.prompt();

  try {
    for await (const rawInput of readline) {
      const userInput = rawInput.trim();

      if (!userInput) {
        readline.prompt();
        continue;
      }

      if (isCommand(userInput)) {
        const result = handleCommand(userInput, agent, output);
        if (result === "exit") {
          break;
        }
        readline.prompt();
        continue;
      }

      await writeAssistantReply(agent, userInput, output);
      readline.prompt();
    }
  } finally {
    readline.close();
  }
}

export async function writeAssistantReply(
  agent: Agent,
  input: string,
  output: NodeJS.WritableStream = stdout
): Promise<Message> {
  let response: Message | undefined;

  output.write("assistant> ");

  for await (const event of agent.streamChat(input)) {
    if (event.type === "chunk") {
      output.write(event.content);
    } else {
      response = event.message;
    }
  }

  output.write("\n");

  if (!response) {
    throw new Error("Provider did not produce an assistant message.");
  }

  return response;
}

export function handleCommand(
  input: string,
  agent: Agent,
  output: NodeJS.WritableStream = stdout
): CommandResult {
  const command = input.trim();

  switch (command) {
    case "/help":
      output.write(formatHelp());
      return "continue";
    case "/history":
      output.write(`${formatConversationHistory(agent.getConversation())}\n`);
      return "continue";
    case "/context":
      output.write(`${formatBuiltContext(agent.previewContext())}\n`);
      return "continue";
    case "/exit":
      output.write("Goodbye.\n");
      return "exit";
    default:
      output.write(`Unknown command: ${command}. Type /help for available commands.\n`);
      return "continue";
  }
}

function isCommand(input: string): boolean {
  return input.startsWith("/");
}

function formatHelp(): string {
  return [
    "Commands:",
    "/help - Show this help.",
    "/history - Show the current in-memory conversation.",
    "/context - Show the provider context assembled from prompt layers.",
    "/exit - Exit the interactive session.",
    ""
  ].join("\n");
}
