export type FlyBuildMode = "none" | "vite-static" | "tanstack-static";

export type FlyComponentRegistryEntry = {
  readonly aliases: readonly string[];
  readonly appDir: string;
  readonly appName: string;
  readonly buildMode: FlyBuildMode;
  readonly configPath: string;
  readonly deployContext: string;
  readonly key: string;
};

const primaryRegion = "ams";

const flyComponentOrder = ["landing"] as const;

export const flyDeploymentConfig = {
  primaryRegion,
} as const;

/** Public HTTPS origins for Fly apps. */
export const flyAppOrigins = {
  landing: "https://pietersoudan-landing.fly.dev",
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
