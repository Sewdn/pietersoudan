import { Argument, Command, Flag } from "effect/unstable/cli";
import { Option } from "effect";
import {
  parseFlyDeployEnvironment,
  runFlyCommand,
  type FlyAction,
} from "../services/fly-operations-service.js";
import {
  runInteractiveFlyDeploy,
  shouldRunInteractiveDeploy,
} from "../services/fly-interactive-deploy-service.js";

const flyDeployFlags = {
  targets: Argument.string("targets").pipe(Argument.withDefault("all")),
  flyArgs: Flag.optional(
    Flag.string("fly-args").pipe(
      Flag.withDescription(
        "Optional extra Fly arguments as a space-separated string, for example '--remote-only'",
      ),
    ),
  ),
  environment: Flag.optional(
    Flag.string("environment").pipe(
      Flag.withDescription("Deploy environment. Only staging is supported for now."),
    ),
  ),
  nonInteractive: Flag.boolean("non-interactive").pipe(
    Flag.withDescription("Skip the interactive picker and deploy using targets and flags."),
    Flag.withDefault(false),
  ),
} as const;

function resolveFlyCommandOptions(
  action: FlyAction,
  input: {
    environment: Option.Option<string>;
    flyArgs: Option.Option<string>;
    targets: string;
  },
) {
  return {
    action,
    environment: Option.isSome(input.environment)
      ? parseFlyDeployEnvironment(input.environment.value)
      : undefined,
    flyArgs: Option.isSome(input.flyArgs) ? input.flyArgs.value : undefined,
    targets: input.targets,
  };
}

export const flyDeployCommand = Command.make(
  "deploy",
  flyDeployFlags,
  ({ environment, flyArgs, nonInteractive, targets }) => {
    if (shouldRunInteractiveDeploy({ environment, nonInteractive, targets })) {
      return runInteractiveFlyDeploy({
        flyArgs: Option.isSome(flyArgs) ? flyArgs.value : undefined,
      });
    }

    return runFlyCommand(resolveFlyCommandOptions("deploy", { environment, flyArgs, targets }));
  },
).pipe(
  Command.withDescription(
    "Build and deploy Fly components. Interactive by default on a TTY; pass --non-interactive with targets and flags for scripts and CI.",
  ),
);

function makeFlyActionCommand(action: FlyAction, description: string) {
  return Command.make(
    action,
    {
      targets: flyDeployFlags.targets,
      environment: flyDeployFlags.environment,
      flyArgs: flyDeployFlags.flyArgs,
    },
    ({ environment, flyArgs, targets }) =>
      runFlyCommand(resolveFlyCommandOptions(action, { environment, flyArgs, targets })),
  ).pipe(Command.withDescription(description));
}

export const flyLogsCommand = makeFlyActionCommand(
  "logs",
  "Show Fly logs for one or more components.",
);

export const flyStatusCommand = makeFlyActionCommand(
  "status",
  "Show Fly status for one or more components.",
);

export const flyOpenCommand = makeFlyActionCommand(
  "open",
  "Open one or more Fly apps in the browser.",
);

export const flySshCommand = makeFlyActionCommand(
  "ssh",
  "Open a Fly SSH console for one or more components.",
);

export const flyMachinesCommand = makeFlyActionCommand(
  "machines",
  "List Fly machines for one or more components.",
);

export const flyCommand = Command.make("fly").pipe(
  Command.withSubcommands([
    flyDeployCommand,
    flyLogsCommand,
    flyStatusCommand,
    flyOpenCommand,
    flySshCommand,
    flyMachinesCommand,
  ]),
  Command.withDescription("Fly.io deployment and operational tasks."),
);
