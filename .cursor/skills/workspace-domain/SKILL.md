---
name: workspace-domain
description: packages/domain — shared types and entities; no IO; consumed by apps and svc-* packages.
globs: ["**/packages/domain/**"]
---

# Domain package (`packages/domain`)

**Canonical:** `skills/workspace-domain/SKILL.md` (mirrored to agent-specific skill directories).

**Purpose:** Cross-cutting **types**, **entities**, and pure logic that **apps** and **`svc-*`** packages both use. No database, HTTP, or Node-only side effects here.

**Scaffold:** `scaffold init … --packages domain` or `scaffold project … --packages domain`.

**Consumption:** `import { … } from "@pietersoudan/domain"` from API handlers (via services), CLI, or UI only for **types** (prefer mapping at boundaries if you keep UI free of domain internals).

See **`skills/backend-workspace/`** for how domain fits with `svc-config` and API layers.
