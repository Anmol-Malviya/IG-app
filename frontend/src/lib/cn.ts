type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

function normalizeClassValue(value: ClassValue): string[] {
  if (!value) return [];

  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeClassValue);
  }

  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([className]) => className);
}

/**
 * Lightweight className composer used across the scheduler UI.
 * Dependency-free to avoid runtime failures when helper packages are
 * missing from an existing node_modules installation.
 */
export function cn(...inputs: ClassValue[]) {
  return inputs.flatMap(normalizeClassValue).join(" ");
}
