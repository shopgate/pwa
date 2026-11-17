/**
 * Checks whether a value is an object that is neither `null` nor an array.
 * @param value The value to check.
 * @returns Whether the value is such an object.
 */
export const isObjectRecord = (value: unknown): value is Record<string, unknown> => (
  !!value && typeof value === 'object' && !Array.isArray(value)
);
