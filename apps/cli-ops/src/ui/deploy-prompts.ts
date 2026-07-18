import { cancel, confirm, isCancel, multiselect, note, select } from "@clack/prompts";
import chalk from "chalk";
import Table from "cli-table3";
import {
  flyDeployEnvironments,
  getCatalogEntriesForKeys,
  type FlyDeployAppCategory,
  type FlyDeployCatalog,
  type FlyDeployEnvironment,
} from "../services/fly-deploy-catalog.js";

let hasShownMultiselectHelp = false;

function showMultiselectHelpOnce(): void {
  if (hasShownMultiselectHelp) {
    return;
  }
  note(
    "Use up/down to navigate, Space to select/deselect, Enter to confirm, a to toggle all.",
    "Keyboard shortcuts",
  );
  hasShownMultiselectHelp = true;
}

function categoryPrefix(category: FlyDeployAppCategory): string {
  switch (category) {
    case "api":
      return "API";
    case "frontend":
      return "Frontend";
  }
}

export async function promptDeployEnvironment(): Promise<FlyDeployEnvironment> {
  const value = await select<FlyDeployEnvironment>({
    message: "Which environment should be deployed?",
    options: [
      {
        value: "staging",
        label: flyDeployEnvironments.staging.label,
        hint: flyDeployEnvironments.staging.hint,
      },
    ],
    initialValue: "staging",
  });

  if (isCancel(value)) {
    cancel("Deploy cancelled.");
    process.exit(0);
  }

  return value;
}

export async function promptDeployTargets(catalog: FlyDeployCatalog): Promise<string[]> {
  const allKeys = catalog.entries.map((entry) => entry.key);

  const selectionMode = await select<"all" | "pick">({
    message: "Which applications should be deployed?",
    options: [
      {
        value: "all",
        label: "All applications",
        hint: "Pre-select registered Fly apps",
      },
      {
        value: "pick",
        label: "Choose individually",
        hint: "Start with nothing selected",
      },
    ],
    initialValue: "all",
  });

  if (isCancel(selectionMode)) {
    cancel("Deploy cancelled.");
    process.exit(0);
  }

  showMultiselectHelpOnce();

  const value = await multiselect<string>({
    message:
      selectionMode === "all"
        ? "Confirm applications (Space to deselect items to skip)"
        : "Select applications to deploy",
    options: catalog.entries.map((entry) => ({
      value: entry.key,
      label: `[${categoryPrefix(entry.category)}] ${entry.label}`,
      hint: entry.hint,
    })),
    initialValues: selectionMode === "all" ? allKeys : [],
    required: true,
  });

  if (isCancel(value)) {
    cancel("Deploy cancelled.");
    process.exit(0);
  }

  if (value.length === 0) {
    throw new Error("Select at least one application to deploy.");
  }

  return value;
}

export function renderDeployPlanTable(
  catalog: FlyDeployCatalog,
  orderedKeys: readonly string[],
): string {
  const entries = getCatalogEntriesForKeys(orderedKeys, catalog);
  const table = new Table({
    head: [chalk.cyan("#"), chalk.cyan("Application"), chalk.cyan("Build"), chalk.cyan("Fly app")],
  });

  entries.forEach((entry, index) => {
    table.push([String(index + 1), entry.label, entry.buildMode, entry.flyAppName]);
  });

  return table.toString();
}

export async function promptDeployConfirm(
  catalog: FlyDeployCatalog,
  orderedKeys: readonly string[],
): Promise<boolean> {
  note(
    [
      chalk.bold(`Pieter Soudan — ${catalog.environmentLabel}`),
      "",
      renderDeployPlanTable(catalog, orderedKeys),
    ]
      .filter(Boolean)
      .join("\n"),
    "Deploy plan",
  );

  const value = await confirm({
    message: `Deploy ${orderedKeys.length} application(s) now?`,
    initialValue: true,
  });

  if (isCancel(value)) {
    cancel("Deploy cancelled.");
    process.exit(0);
  }

  return value;
}
