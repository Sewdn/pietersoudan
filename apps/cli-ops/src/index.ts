#!/usr/bin/env bun
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BunServices, BunRuntime } from "@effect/platform-bun";
import { Command } from "effect/unstable/cli";
import { Effect } from "effect";
import { rootCommand } from "./commands/subcommands.js";

const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8")) as {
  version?: string;
};

const program = Command.run(rootCommand, {
  version: pkg.version ?? "0.0.0",
});

program.pipe(Effect.provide(BunServices.layer), BunRuntime.runMain);
