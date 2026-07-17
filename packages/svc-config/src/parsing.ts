export type NodeEnv = "development" | "production" | "test";

export const parseBoolean = (value: boolean | string | undefined) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return undefined;
};

export const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const parseNodeEnv = (value: string | undefined): NodeEnv => {
  if (value === "production" || value === "test") {
    return value;
  }

  return "development";
};

export const parseCsv = (value: string | undefined, fallback: readonly string[]) =>
  (value ?? fallback.join(","))
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
