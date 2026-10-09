import { isPlainObject } from 'lodash';

type Options<T> = { [K in keyof T]?: readonly T[K][] };

/**
 * Keeps the values of a settings branch that have the type of their default and, for values with a
 * fixed set of options, are one of them. Everything else is dropped, so the default stays in place.
 * @param branch The incoming settings branch.
 * @param defaults The defaults of the branch.
 * @param options The allowed values per key.
 * @returns The valid values, or undefined when the branch is no object.
 */
export const pickValidSettings = <T extends object>(
  branch: unknown,
  defaults: T,
  options: Options<T> = {}
): Partial<T> | undefined => {
  if (!isPlainObject(branch)) {
    return undefined;
  }

  const incoming = branch as Record<string, unknown>;

  return (Object.keys(defaults) as (keyof T & string)[]).reduce<Partial<T>>((valid, key) => {
    const value = incoming[key];
    const allowed = options[key] as readonly unknown[] | undefined;

    if (typeof value !== typeof defaults[key] || (allowed && !allowed.includes(value))) {
      return valid;
    }

    return {
      ...valid,
      [key]: value,
    };
  }, {});
};
