import { isPlainObject } from 'lodash';

/**
 * Checks whether a value is a plain object, e.g. `{}` or `Object.create(null)`, the same rule the
 * app settings apply. Arrays, class instances and maps are none.
 * @param value The value to check.
 * @returns Whether the value is a plain object.
 */
export const isObjectRecord = (value: unknown): value is Record<string, unknown> => (
  isPlainObject(value)
);
