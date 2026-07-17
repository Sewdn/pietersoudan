import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";
import * as ConfigProvider from "effect/ConfigProvider";

export type ProcessEnvInput = Record<string, string | undefined>;

export type LoadProcessEnvOptions = {
  cwd?: string;
  fileNames?: readonly string[];
  mode?: string;
  override?: boolean;
  processEnv?: ProcessEnvInput;
  searchParents?: boolean;
  stopAt?: string;
};

export type LoadProcessEnvResult = {
  env: ProcessEnvInput;
  loadedFiles: string[];
};

export type LoadProcessEnvProviderResult = LoadProcessEnvResult & {
  provider: ConfigProvider.ConfigProvider;
};

type DotenvProcessEnv = Record<string, string>;

const getCurrentDirectory = (cwd?: string) => resolve(cwd ?? process.cwd());

const getParentDirectories = ({
  cwd,
  searchParents = true,
  stopAt,
}: Pick<LoadProcessEnvOptions, "cwd" | "searchParents" | "stopAt">) => {
  const directories: string[] = [];
  const resolvedStopAt = stopAt ? resolve(stopAt) : undefined;
  let currentDirectory = getCurrentDirectory(cwd);

  while (true) {
    directories.push(currentDirectory);

    if (!searchParents || currentDirectory === resolvedStopAt) {
      return directories;
    }

    const parentDirectory = dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      return directories;
    }

    currentDirectory = parentDirectory;
  }
};

export const createEnvFileNames = (mode?: string) =>
  mode
    ? ([`.env.${mode}.local`, `.env.${mode}`, ".env.local", ".env"] as const)
    : ([".env.local", ".env"] as const);

export const resolveEnvFilePaths = ({
  cwd,
  fileNames,
  mode,
  searchParents,
  stopAt,
}: Pick<
  LoadProcessEnvOptions,
  "cwd" | "fileNames" | "mode" | "searchParents" | "stopAt"
>) => {
  const directories = getParentDirectories({
    cwd,
    searchParents,
    stopAt,
  });
  const names = fileNames ?? createEnvFileNames(mode);

  return directories
    .flatMap((directory) => names.map((fileName) => join(directory, fileName)))
    .filter((filePath) => existsSync(filePath));
};

export const loadProcessEnv = ({
  cwd,
  fileNames,
  mode,
  override = false,
  processEnv = process.env,
  searchParents = true,
  stopAt,
}: LoadProcessEnvOptions = {}): LoadProcessEnvResult => {
  const loadedFiles = resolveEnvFilePaths({
    cwd,
    fileNames,
    mode,
    searchParents,
    stopAt,
  });

  if (loadedFiles.length > 0) {
    loadDotenv({
      override,
      path: loadedFiles,
      processEnv: processEnv as DotenvProcessEnv,
    });
  }

  return {
    env: processEnv,
    loadedFiles,
  };
};

export const createConfigProvider = (env: ProcessEnvInput) =>
  ConfigProvider.fromUnknown(
    Object.fromEntries(
      Object.entries(env).filter((entry): entry is [string, string] =>
        typeof entry[1] === "string",
      ),
    ),
  );

export const loadProcessEnvProvider = (
  options: LoadProcessEnvOptions = {},
): LoadProcessEnvProviderResult => {
  const result = loadProcessEnv(options);

  return {
    ...result,
    provider: createConfigProvider(result.env),
  };
};

export const loadProcessEnvProviderFromModule = (
  moduleUrl: string,
  options: Omit<LoadProcessEnvOptions, "cwd"> = {},
): LoadProcessEnvProviderResult =>
  loadProcessEnvProvider({
    ...options,
    cwd: resolveDirectoryFromModuleUrl(moduleUrl),
  });

export const resolveDirectoryFromModuleUrl = (moduleUrl: string) =>
  dirname(fileURLToPath(moduleUrl));
