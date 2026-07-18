import { Effect, Option } from "effect";
import { getFlyDeployCatalog, sortCatalogKeysByDeployOrder } from "./fly-deploy-catalog.js";
import { runFlyCommand } from "./fly-operations-service.js";
import {
  promptDeployConfirm,
  promptDeployEnvironment,
  promptDeployTargets,
} from "../ui/deploy-prompts.js";
import { createOpsUI, isInteractiveTerminal } from "../ui/ops-ui.js";

export type RunInteractiveFlyDeployOptions = {
  readonly flyArgs?: string;
};

export function runInteractiveFlyDeploy(
  options: RunInteractiveFlyDeployOptions,
): Effect.Effect<void, Error> {
  return Effect.tryPromise({
    try: async () => {
      const ui = createOpsUI();
      ui.intro("Pieter Soudan deploy");

      const environment = await promptDeployEnvironment();
      const catalog = getFlyDeployCatalog(environment);
      const selectedKeys = await promptDeployTargets(catalog);
      const orderedKeys = sortCatalogKeysByDeployOrder(selectedKeys, catalog);
      const confirmed = await promptDeployConfirm(catalog, orderedKeys);

      if (!confirmed) {
        ui.cancelled();
        return;
      }

      await Effect.runPromise(
        runFlyCommand({
          action: "deploy",
          environment,
          flyArgs: options.flyArgs,
          targets: orderedKeys.join(","),
        }),
      );

      ui.outro(`Deployed ${orderedKeys.length} application(s) to ${catalog.environmentLabel}.`);
    },
    catch: (error) => (error instanceof Error ? error : new Error(String(error))),
  });
}

export function shouldRunInteractiveDeploy(input: {
  readonly environment: Option.Option<string>;
  readonly nonInteractive: boolean;
  readonly targets: string;
}): boolean {
  if (input.nonInteractive) {
    return false;
  }
  if (!isInteractiveTerminal()) {
    return false;
  }
  if (input.targets.trim() !== "all") {
    return false;
  }
  if (Option.isSome(input.environment)) {
    return false;
  }
  return true;
}
