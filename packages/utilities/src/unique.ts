/**
 * Removes duplicate values from an array
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}
