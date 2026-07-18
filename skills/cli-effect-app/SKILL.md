---
name: cli-effect-app
description: Effect CLI apps — subcommands, flags, and handlers via effect/unstable/cli and scaffold cli expansions.
globs: ["**/apps/cli-*/**"]
---

# Effect CLI app

**Canonical:** `skills/cli-effect-app/SKILL.md` (mirrored to `.cursor/`, `.claude/`, `.codex/` skills folders).

Scaffolded CLIs use **Effect 4** (`effect@beta`) with **`effect/unstable/cli`** for parsing and help, and **`@effect/platform-bun`** (`BunServices.layer`, `BunRuntime.runMain`) for the runtime. They are **not** Commander-based.

## Reference

- From the monorepo root: `bunx effect-solutions show cli` — patterns for `Command`, `Argument`, `Flag`, `Command.withSubcommands`, and `Command.run`.
- Shared Effect source (prepared during `scaffold project`): `~/.local/share/effect-solutions/effect` — use **Dora** from that directory to query symbols and read `packages/cli` and related sources; do not re-document clone or `dora init` steps here.

## Layout

- `src/index.ts` — `Command.run(rootCommand, { version })` + `BunRuntime.runMain`
- `src/commands/subcommands.ts` — `rootCommand` and `Command.withSubcommands([...])` (patched by `scaffold cli add-command`)
- `src/commands/<name>.ts` — one `Command.make` export per subcommand
- `src/services/` — shared logic (see `scaffold cli add-service`)

## Scaffold expansions

Use from **repository root**. If several CLI apps exist, pass **`--app <folder>`** (e.g. `cli-tools`).

```bash
scaffold cli add-command <name> [-a <app>] [-d <description>]
scaffold cli add-service <name> [-a <app>]
```

After **add-command**, register the new export in `subcommands.ts` automatically; implement the handler with `Effect` (e.g. `Console.log`, `Effect.gen`, services from layers).

## Patterns

- **Subcommand handler:** return an `Effect` (see `Command.make` third argument in effect-solutions examples).
- **Services (Effect 4):** define with `ServiceMap.Service<…>()("Key")` and provide via `Layer.succeed(MyService)({ … })` — see `Layer` / `ServiceMap` in the installed `effect` package and `bunx effect-solutions show cli` for composition with `BunServices.layer`.
- **Parent + shared flags:** `Command.withSharedFlags` on the parent, then yield the parent command inside subcommand handlers when needed.
- **Tests:** use `Command.run*` variants that accept explicit argv where available, or spawn `bun run src/index.ts` with fixture args.
