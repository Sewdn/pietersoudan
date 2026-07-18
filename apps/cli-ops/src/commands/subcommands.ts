import { Command } from "effect/unstable/cli";
import { flyCommand } from "./fly.js";

export const rootCommand = Command.make("cli-ops").pipe(
  Command.withSubcommands([flyCommand]),
);
