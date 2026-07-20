import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  flyRouterCertificates,
  flyDeploymentConfig,
  getRouterComponent,
} from "../../pietersoudan-config";
import { Effect } from "effect";

const cliOpsDir = fileURLToPath(new URL("../..", import.meta.url));
const repoRoot = resolve(cliOpsDir, "../..");

function ensureFlyInstalled(): Effect.Effect<void, Error> {
  return Effect.sync(() => {
    if (Bun.which("fly")) {
      return;
    }
    throw new Error(
      "fly CLI not found. Install it from https://fly.io/docs/hands-on/install-flyctl/.",
    );
  });
}

function runProcess(command: readonly string[], cwd: string): Effect.Effect<void, Error> {
  return Effect.tryPromise({
    try: async () => {
      const subprocess = Bun.spawn([...command], {
        cwd,
        env: process.env,
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
      });
      const exitCode = await subprocess.exited;
      if (exitCode !== 0) {
        throw new Error(`Command failed (${exitCode}): ${command.join(" ")} (cwd: ${cwd})`);
      }
    },
    catch: (error) => (error instanceof Error ? error : new Error(String(error))),
  });
}

function runFlyCertsCheckAll(configPath: string): Effect.Effect<void, Error> {
  return Effect.forEach(flyRouterCertificates, (hostname) =>
    Effect.log(`==> fly certs check ${hostname}`).pipe(
      Effect.andThen(
        runProcess(["fly", "certs", "check", hostname, "--config", configPath], repoRoot),
      ),
    ),
  ).pipe(Effect.asVoid);
}

export function runFlyCertsSetup(): Effect.Effect<void, Error> {
  const router = getRouterComponent();
  const configPath = resolve(repoRoot, router.configPath);

  return ensureFlyInstalled().pipe(
    Effect.andThen(
      Effect.log(
        `Adding TLS certificates on ${router.appName} for ${flyDeploymentConfig.primaryDomain}...`,
      ),
    ),
    Effect.andThen(
      Effect.forEach(flyRouterCertificates, (hostname) =>
        Effect.log(`==> fly certs add ${hostname}`).pipe(
          Effect.andThen(
            runProcess(["fly", "certs", "add", hostname, "--config", configPath], repoRoot),
          ),
        ),
      ),
    ),
    Effect.andThen(runFlyCertsCheckAll(configPath)),
  );
}

export function runFlyCertsCheck(): Effect.Effect<void, Error> {
  const router = getRouterComponent();
  const configPath = resolve(repoRoot, router.configPath);

  return ensureFlyInstalled().pipe(
    Effect.andThen(runFlyCertsCheckAll(configPath)),
  );
}

export function runFlyFlycastSetup(targetAppName: string): Effect.Effect<void, Error> {
  return ensureFlyInstalled().pipe(
    Effect.andThen(
      Effect.log(`Allocating Flycast IPv6 for ${targetAppName} (idempotent if already set)...`),
    ),
    Effect.andThen(
      runProcess(["fly", "ips", "allocate-v6", "--private", "--app", targetAppName], repoRoot),
    ),
    Effect.asVoid,
  );
}

export function runFlyRouterBootstrap(): Effect.Effect<void, Error> {
  return runFlyCertsSetup();
}
