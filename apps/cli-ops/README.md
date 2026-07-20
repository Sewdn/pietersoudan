# CLI — cli-ops

Command-line application for Fly.io deployment, built with **Effect 4** (`effect/unstable/cli`) and **`@effect/platform-bun`**.

## Fly deploy

Deploy wrappers live under `deploy/`; registry paths are in `apps/cli-ops/pietersoudan-config.ts`.

```bash
pietersoudan-ops fly deploy landing
pietersoudan-ops fly deploy router
pietersoudan-ops fly deploy all
pietersoudan-ops fly status landing
pietersoudan-ops fly logs landing
pietersoudan-ops fly open landing

# Custom domain (pietersoudan.be + wildcard)
pietersoudan-ops fly domain bootstrap
pietersoudan-ops fly certs setup
pietersoudan-ops fly certs check
```

The landing deploy prerenders `apps/frontend-landing`, copies `dist/client/` into `deploy/frontend-landing/dist/`, then runs `fly deploy`. The router deploy generates nginx config from `flyRouterRoutes` and proxies to backend apps over `.internal`.

See [`deploy/README.md`](../../deploy/README.md) for Fly app names, DNS, and wildcard certificate setup.

## Scripts

- `bun run start` — run the CLI
- `bun run build` — compile TypeScript

After `bun install`, the CLI is linked globally via `postinstall: bun link` as **`pietersoudan-ops`**.
