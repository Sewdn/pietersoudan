# Deploy

Fly.io and nginx **distribution** configs — not application source. Each subdirectory holds `Dockerfile`, `fly.toml`, and (for static frontends) `nginx.conf`. `cli-ops` deploys from the registry in `apps/cli-ops/pietersoudan-config.ts`: the landing app is prerendered with TanStack Start, then `dist/client/` is copied into `deploy/frontend-landing/dist/` before `fly deploy`.

| Path | Build source | Fly app | Public origin |
| --- | --- | --- | --- |
| `frontend-landing` | `apps/frontend-landing` | `pietersoudan-landing` | `https://pietersoudan-landing.fly.dev` |

Registry paths: `apps/cli-ops/pietersoudan-config.ts` (`configPath` / `deployContext`).

## Landing static build

`apps/frontend-landing` uses TanStack Start with **prerendering** enabled in `vite.config.ts`. `bun run build` emits static HTML under `apps/frontend-landing/dist/client/`. The deploy CLI copies that tree into `deploy/frontend-landing/dist/` for the nginx image.

## Commands

From the repo root (after `bun install` in `apps/cli-ops`):

```bash
pietersoudan-ops fly deploy landing
pietersoudan-ops fly deploy all
pietersoudan-ops fly status landing
pietersoudan-ops fly logs landing
pietersoudan-ops fly open landing
```

Requires the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) and an authenticated Fly account.
