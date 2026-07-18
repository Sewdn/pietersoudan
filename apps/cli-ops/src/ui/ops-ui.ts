import { intro, outro } from "@clack/prompts";
import chalk from "chalk";

export function isInteractiveTerminal(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

export function createOpsUI() {
  return {
    intro(title: string) {
      intro(chalk.cyan(title));
    },
    outro(message: string) {
      outro(chalk.green(message));
    },
    cancelled(message = "Deploy cancelled.") {
      outro(chalk.yellow(message));
    },
  };
}
