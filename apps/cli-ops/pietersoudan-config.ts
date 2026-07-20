export type FlyBuildMode = "none" | "vite-static" | "tanstack-static" | "router";

export type FlyComponentRegistryEntry = {
  readonly aliases: readonly string[];
  readonly appDir: string;
  readonly appName: string;
  readonly buildMode: FlyBuildMode;
  readonly configPath: string;
  readonly deployContext: string;
  readonly key: string;
};

export type FlyRouterRoute = {
  readonly hostnames: readonly string[];
  readonly targetAppName: string;
  readonly targetPort?: number;
};

const primaryRegion = "ams";
const primaryDomain = "pietersoudan.be";

const flyComponentOrder = ["landing", "router"] as const;

export const flyDeploymentConfig = {
  primaryRegion,
  primaryDomain,
} as const;

/**
 * TLS certificates on the edge router app.
 * Apex and wildcard only — `*.pietersoudan.be` already covers `www` and other
 * single-label subdomains. Do not add a separate `www` cert; an unverified
 * www entry takes precedence and breaks HTTPS on www.
 */
export const flyRouterCertificates = [primaryDomain, `*.${primaryDomain}`] as const;

/**
 * Hostname → Fly backend routing for the edge router.
 * Add a row when you deploy a new app on a subdomain.
 */
export const flyRouterRoutes = [
  {
    hostnames: [primaryDomain, `www.${primaryDomain}`],
    targetAppName: "pietersoudan-landing",
  },
] as const satisfies readonly FlyRouterRoute[];

/** Public HTTPS origins for Fly apps. */
export const flyAppOrigins = {
  landing: `https://${primaryDomain}`,
  landingFlyDev: "https://pietersoudan-landing.fly.dev",
  router: `https://${primaryDomain}`,
} as const;

export const flyComponentRegistry = {
  components: [
    {
      key: "landing",
      appName: "pietersoudan-landing",
      aliases: ["frontend-landing", "portfolio"],
      appDir: "apps/frontend-landing",
      buildMode: "tanstack-static" as const,
      configPath: "deploy/frontend-landing/fly.toml",
      deployContext: "deploy/frontend-landing",
    },
    {
      key: "router",
      appName: "pietersoudan-router",
      aliases: ["edge", "proxy"],
      appDir: "deploy/router",
      buildMode: "router" as const,
      configPath: "deploy/router/fly.toml",
      deployContext: "deploy/router",
    },
  ],
  deployOrder: flyComponentOrder,
  allOrder: flyComponentOrder,
} as const satisfies {
  readonly components: readonly FlyComponentRegistryEntry[];
  readonly deployOrder: readonly string[];
  readonly allOrder: readonly string[];
};

export function formatFlyTargetHint(): string {
  const targets = flyComponentRegistry.components.flatMap((component) => [
    component.key,
    ...component.aliases,
  ]);
  return ["all", ...Array.from(new Set(targets))].join(", ");
}

export function getRouterComponent(): FlyComponentRegistryEntry {
  const router = flyComponentRegistry.components.find((component) => component.key === "router");
  if (!router) {
    throw new Error("Fly component registry is missing the router entry.");
  }
  return router;
}
