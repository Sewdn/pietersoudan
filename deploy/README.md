# Deploy

Fly.io **distribution** configs — not application source. Each subdirectory holds `Dockerfile`, `fly.toml`, and nginx config. `cli-ops` deploys from the registry in `apps/cli-ops/pietersoudan-config.ts`.

## Architecture

Public traffic for **pietersoudan.be** goes through a single **edge router** Fly app. TLS (including a wildcard for subdomains) terminates at Fly; nginx on the router proxies to backend apps over the private network (`.internal`).

```
Browser ──HTTPS──▶ pietersoudan-router (certs: pietersoudan.be, *.pietersoudan.be)
                         │
                         ├─ pietersoudan.be / www ──▶ pietersoudan-landing.internal:8080
                         └─ future.api.pietersoudan.be ──▶ pietersoudan-api.internal:8080
```

Backend apps stay on `.fly.dev` for debugging but do **not** need their own public custom-domain certificates.

| Path | Role | Fly app | Public origin |
| --- | --- | --- | --- |
| `frontend-landing` | Portfolio static site | `pietersoudan-landing` | `https://pietersoudan.be` (via router) |
| `router` | Edge reverse proxy | `pietersoudan-router` | `https://pietersoudan.be` |

Routing table and certificate hostnames: `apps/cli-ops/pietersoudan-config.ts` (`flyRouterRoutes`, `flyRouterCertificates`).

## First-time setup (pietersoudan.be + wildcard)

### 1. Create Fly apps

```bash
fly apps create pietersoudan-landing --org <your-org>
fly apps create pietersoudan-router --org <your-org>
```

### 2. Deploy backends, then the router

```bash
pietersoudan-ops fly deploy landing --non-interactive
pietersoudan-ops fly deploy router --non-interactive
```

### 3. Request TLS certificates on the router

Backends in the same Fly org are reachable as `<app-name>.internal` — no Flycast setup required for the router.

```bash
pietersoudan-ops fly certs setup
pietersoudan-ops fly certs check
```

Or run the combined bootstrap (cert requests only):

```bash
pietersoudan-ops fly domain bootstrap
```

This adds:

- `pietersoudan.be` (apex — **not** covered by the wildcard alone)
- `*.pietersoudan.be` (wildcard — covers `www`, `api`, and other single-label subdomains)

Do **not** add a separate `www` certificate. The wildcard already includes `www.pietersoudan.be`. A pending `www` cert on the app can take precedence and break TLS on that hostname until removed:

```bash
fly certs remove www.pietersoudan.be --config deploy/router/fly.toml
```

### 4. Configure DNS at your registrar

Run `pietersoudan-ops fly certs check` and follow the records Fly prints. Typically:

| Record | Purpose |
| --- | --- |
| `A` / `AAAA` for `@` and `*` | Point apex and all subdomains at the **router** app IPs |
| `_fly-ownership` TXT | Prove domain ownership (allows flexible DNS without strict AAAA rules) |
| `_acme-challenge` CNAME | DNS-01 validation for the wildcard certificate |

**Wildcard note:** Let's Encrypt wildcards require DNS-01. If you use Cloudflare proxy (orange cloud), Universal SSL can break `_acme-challenge`; use DNS-only (grey cloud) for ACME records, or import a Cloudflare Origin Certificate with `fly certs import`. See [Fly custom domains](https://fly.io/docs/networking/custom-domain/).

Point **both** `@` and `*` at the router — not at individual backend apps.

### 5. Redeploy after routing changes

When you add a subdomain, edit `flyRouterRoutes` in `pietersoudan-config.ts`, then:

```bash
pietersoudan-ops fly deploy <backend> --non-interactive
pietersoudan-ops fly deploy router --non-interactive
```

No new certificate is needed for `something.pietersoudan.be` once the wildcard is active.

## Landing static build

`apps/frontend-landing` uses TanStack Start with **prerendering** enabled in `vite.config.ts`. `bun run build` emits static HTML under `apps/frontend-landing/dist/client/`. The deploy CLI copies that tree into `deploy/frontend-landing/dist/` for the nginx image.

## Commands

From the repo root (after `bun install`):

```bash
pietersoudan-ops fly deploy landing
pietersoudan-ops fly deploy router
pietersoudan-ops fly deploy all --non-interactive

pietersoudan-ops fly domain bootstrap
pietersoudan-ops fly certs setup
pietersoudan-ops fly certs check

pietersoudan-ops fly status landing
pietersoudan-ops fly logs router
pietersoudan-ops fly open landing
```

Requires the [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) and an authenticated Fly account.

## Adding another app on a subdomain

Example: `api.pietersoudan.be` → new Fly app `pietersoudan-api`.

1. Scaffold/deploy the new app and add it to `flyComponentRegistry` in `pietersoudan-config.ts`.
2. Add a route:

   ```ts
   {
     hostnames: ["api.pietersoudan.be"],
     targetAppName: "pietersoudan-api",
   }
   ```

3. `pietersoudan-ops fly deploy api --non-interactive`
4. `pietersoudan-ops fly deploy router --non-interactive`

The existing `*.pietersoudan.be` wildcard certificate covers the new hostname automatically.
