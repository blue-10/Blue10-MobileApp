export function normalizeMap<T>(value: any[] | undefined, normalizer: (item: any) => T): T[] {
  return value ? value.map(normalizer) : [];
}
