/**
 * Reads image values coming from the messages (t.raw(...)).
 * Always returns something usable, even if the stored value is unexpected.
 */

export function imageList(value: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string" && v.length > 0);
  }
  if (typeof value === "string" && value.length > 0) return [value];
  return fallback;
}

export function singleImage(value: unknown, fallback: string): string {
  return imageList(value, [fallback])[0] ?? fallback;
}
