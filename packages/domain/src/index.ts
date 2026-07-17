/**
 * Shared core domain primitives consumed by `domain-*`, `svc-*`, and `ui-*` packages.
 * Keep this package framework-free and focused on cross-cutting business types.
 */

export type EntityId = string;

export type IsoDateString = string;

export type Optional<TValue> = TValue | null | undefined;

export type PaginationInput = {
  readonly page: number;
  readonly pageSize: number;
};

export type Page<TItem> = {
  readonly items: readonly TItem[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
};
