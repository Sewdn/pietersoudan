---
name: backend-workspace
description: Backend stack — domain, svc-config, API apps (Elysia/Hono/Fastify), svc-* packages, scaffold service/module, API expansion commands.
globs:
  [
    "**/packages/domain/**",
    "**/packages/svc-*/**",
    "**/apps/api-*/**",
  ]
---

# Backend workspace (scaffold CLI)

**Canonical skill file:** `skills/backend-workspace/SKILL.md`. The same content is synced to `.cursor/skills/`, `.claude/skills/`, and `.codex/skills/` for multi-agent tooling.

For **all** `scaffold` commands and generic repo layout, use **`skills/scaffolding/SKILL.md`** first.

Workspace imports use **`@pietersoudan/…`** (e.g. `@pietersoudan/domain`, `@pietersoudan/svc-config`).

Backend foundations also include **`packages/core-svc`** and **`packages/core-http-app`**. Framework adapters such as **`packages/core-http-elysia`**, **`packages/core-http-hono`**, and **`packages/core-http-fastify`** are added when corresponding API apps are scaffolded.

## CLI commands (repo root)

| Command | Purpose |
|--------|---------|
| `scaffold project … --packages domain,svc-config,…` | Optional shared packages at create |
| `scaffold init … --packages …` | Base repo + packages (no apps) |
| `scaffold app <name> --type api-elysia \| api-hono \| api-fastify` | Add API application |
| `scaffold service <name>` | Add `packages/svc-<name>` (Effect-based service template) |
| `scaffold package <name> --type service` | Generic service package |
| `scaffold slice <name>` | **Pair:** `svc-<name>` + `ui-<name>` (no direct dependency; share **domain** types) |

Use **`--non-interactive`** for automation.

## Shared packages

| Package | Role |
|---------|------|
| **`packages/domain`** | Shared types and entities for apps and services. No IO. |
| **`packages/svc-config`** | Typed configuration access (dotenv). Used by backend/services/CLI — not by UI packages. |

API handlers and services should use **domain** types; APIs should call a **service layer** that wraps data packages (e.g. Prisma), not Prisma directly in route handlers.

## API app types

| `--type` | Framework |
|----------|-----------|
| `api-elysia` | Elysia + Swagger plugin (see app README) |
| `api-hono` | Hono |
| `api-fastify` | Fastify |

Apps live under **`apps/api-<framework>-<name>/`**. API module expansions are invoked through a single generic command and dispatched from the target app metadata.

## API expansions (per framework)

Run from repo root; use **`-a, --app <dirName>`** when multiple API apps exist.

| Subcommand | Effect |
|------------|--------|
| `scaffold app-module remove-module <name>` | Remove `src/modules/<name>/` and unwind `src/modules/index.ts` |
| `scaffold app-module add-module <name>` | Generic module under `src/modules/<name>/` |
| `scaffold app-module add-service-module <name> --service <svc>` | Runtime-backed module that depends on an existing `svc-*` package |
| `scaffold app-module add-crud-module <entity> --service <svc>` | CRUD HTTP module mapping GET/POST/PUT/DELETE to a service entity module |

Examples:

```bash
scaffold app-module add-crud-module users --service accounts --app api-elysia-api
scaffold app-module add-service-module pricing --service pricing-engine --app api-hono-api
scaffold app-module add-module system-info --app api-fastify-api
```

When an API app exists, see **`skills/api-elysia-app/`**, **`skills/api-hono-app/`**, or **`skills/api-fastify-app/`** for a short expansion cheat sheet (same files under agent-specific mirror paths).

## Service packages (`svc-*`)

- Live under **`packages/svc-<name>/`**.
- Intended for **backend and CLI** only; **never** depend on `ui-*` from a service.
- Usually depend on **`core-svc`** and **`svc-config`**; add **`domain`** when the service owns shared business types.
- **`svc-prisma`:** database scripts (`db:generate`, `db:push`, `db:migrate`, `db:studio`) — see package README.

## Improving backend code

1. Add routes via **expansion commands** before heavy customization.
2. Keep **domain** pure; put persistence in **`svc-*`** layers.
3. Add new backend capabilities with **`scaffold service`** or a typed data package, then wire from API services.

## Related skills

**`skills/frontend-workspace/`** for UI apps and packages. Additional package- or app-specific skills appear under **`skills/<skill-id>/`** when those pieces are scaffolded.
