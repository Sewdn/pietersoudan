import { Config, ConfigProvider, Effect, Layer, Option, ServiceMap } from "effect";
import {
  parseBoolean,
  parseNodeEnv,
  parseNumber,
  type NodeEnv,
} from "./parsing.js";

export type RuntimeConfigShape = {
  corsOrigin?: string;
  ipv6Only?: boolean;
  nodeEnv: NodeEnv;
  port: number;
};

export type RuntimeEnvInput = {
  CORS_ORIGIN?: string;
  IPV6_ONLY?: boolean | string;
  NODE_ENV?: string;
  PORT?: string;
};

const optionalStringConfig = (key: string) =>
  Config.option(Config.string(key)).pipe(
    Config.map((value) =>
      Option.match(value, {
        onNone: () => undefined,
        onSome: (currentValue) => currentValue,
      }),
    ),
  );

export const runtimeConfigConfig = Config.all({
  corsOrigin: optionalStringConfig("CORS_ORIGIN"),
  ipv6Only: optionalStringConfig("IPV6_ONLY").pipe(
    Config.map((value) => parseBoolean(value)),
  ),
  nodeEnv: optionalStringConfig("NODE_ENV").pipe(
    Config.map((value) => parseNodeEnv(value)),
  ),
  port: Config.number("PORT").pipe(Config.withDefault(3000)),
});

export class RuntimeConfig extends ServiceMap.Service<
  RuntimeConfig,
  RuntimeConfigShape
>()("@pietersoudan/svc-config/RuntimeConfig") {}

export const RuntimeConfigLayer = Layer.effect(
  RuntimeConfig,
  Effect.flatMap(ConfigProvider.ConfigProvider.asEffect(), (provider) =>
    Effect.map(runtimeConfigConfig.parse(provider), RuntimeConfig.of),
  ),
);

export const createRuntimeConfig = (
  config: RuntimeEnvInput,
): RuntimeConfigShape => ({
  corsOrigin: config.CORS_ORIGIN,
  ipv6Only: parseBoolean(config.IPV6_ONLY),
  nodeEnv: parseNodeEnv(config.NODE_ENV),
  port: parseNumber(config.PORT, 3000),
});
