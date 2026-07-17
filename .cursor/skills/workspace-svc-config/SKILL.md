---
name: workspace-svc-config
description: packages/svc-config — typed configuration service (dotenv); for backend and CLI, not UI packages.
globs: ["**/packages/svc-config/**"]
---

# Configuration service (`packages/svc-config`)

**Canonical:** `skills/workspace-svc-config/SKILL.md` (mirrored for Cursor, Claude Code, Codex, etc.).

**Purpose:** Central **typed config** access (environment variables via dotenv). Used by **backend apps**, **`svc-*`**, and **CLI** — **do not** add as a dependency of `ui` / `ui-lib` / `ui-*`.

**Scaffold:** `scaffold init … --packages svc-config` or `scaffold project … --packages svc-config`.

**Pattern:** Services read config through this package instead of scattering `process.env` usage.

See **`skills/backend-workspace/`**.
