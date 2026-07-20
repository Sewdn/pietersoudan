import { flyComponentRegistry, type FlyBuildMode } from "../../pietersoudan-config";

export type FlyDeployEnvironment = "staging";

export type FlyDeployAppCategory = "api" | "frontend";

export type FlyDeployCatalogEntry = {
  readonly key: string;
  readonly label: string;
  readonly category: FlyDeployAppCategory;
  readonly buildMode: FlyBuildMode;
  readonly flyAppName: string;
  readonly hint: string;
  readonly deployOrder: number;
};

export type FlyDeployCatalog = {
  readonly environment: FlyDeployEnvironment;
  readonly environmentLabel: string;
  readonly entries: readonly FlyDeployCatalogEntry[];
  readonly deployOrder: readonly string[];
};

export const flyDeployEnvironments = {
  staging: {
    label: "Staging",
    hint: "Current Fly staging apps",
  },
} as const satisfies Record<
  FlyDeployEnvironment,
  { readonly label: string; readonly hint: string }
>;

const labelByKey: Record<string, string> = {
  landing: "Portfolio landing",
  router: "Edge router (pietersoudan.be)",
};

const categoryByKey: Record<string, FlyDeployAppCategory> = {
  landing: "frontend",
  router: "frontend",
};

const buildModeHint = (buildMode: FlyBuildMode): string => {
  switch (buildMode) {
    case "none":
      return "Docker/Fly build";
    case "router":
      return "Generated nginx reverse proxy";
    case "vite-static":
      return "Vite static build";
    case "tanstack-static":
      return "TanStack Start prerender";
  }
};

export function getFlyDeployCatalog(
  environment: FlyDeployEnvironment = "staging",
): FlyDeployCatalog {
  const deployOrderIndex = new Map(
    flyComponentRegistry.deployOrder.map((key, index) => [key, index]),
  );

  return {
    environment,
    environmentLabel: flyDeployEnvironments[environment].label,
    deployOrder: flyComponentRegistry.deployOrder,
    entries: flyComponentRegistry.components
      .map((component): FlyDeployCatalogEntry => {
        const deployOrder = deployOrderIndex.get(component.key) ?? 999;
        return {
          key: component.key,
          label: labelByKey[component.key] ?? component.key,
          category: categoryByKey[component.key] ?? "frontend",
          buildMode: component.buildMode,
          flyAppName: component.appName,
          hint: `${component.appName} • ${buildModeHint(component.buildMode)}`,
          deployOrder,
        };
      })
      .sort((left, right) => left.deployOrder - right.deployOrder),
  };
}

export function sortCatalogKeysByDeployOrder(
  keys: readonly string[],
  catalog: FlyDeployCatalog,
): readonly string[] {
  const orderIndex = new Map(catalog.deployOrder.map((key, index) => [key, index]));
  return [...keys].sort(
    (left, right) => (orderIndex.get(left) ?? 999) - (orderIndex.get(right) ?? 999),
  );
}

export function getCatalogEntriesForKeys(
  keys: readonly string[],
  catalog: FlyDeployCatalog,
): readonly FlyDeployCatalogEntry[] {
  const byKey = new Map(catalog.entries.map((entry) => [entry.key, entry]));
  return keys
    .map((key) => byKey.get(key))
    .filter((entry): entry is FlyDeployCatalogEntry => Boolean(entry));
}
