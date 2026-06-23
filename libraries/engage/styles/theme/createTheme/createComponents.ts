import merge from 'lodash/merge';
import isPlainObject from 'lodash/isPlainObject';
import mapValues from 'lodash/mapValues';

import type {
  ComponentsOptions,
  Components,
  ComponentsFromSchema,
} from './createComponents.types';
import { componentsDefaults, componentsSchema } from './createComponents.types';

export type { ComponentsOptions, Components, ComponentVars } from './createComponents.types';

/**
 * Deeply resolves a components object:
 * - strings remain strings
 * - functions are executed with `theme`
 * - arrays and objects are recursively traversed
 * @param input The input components object to resolve.
 * @param theme The theme object to pass to functions if any token values are functions.
 * @returns The fully resolved components object with the same shape as the input.
 */
export function resolveComponentsValues<TTheme, TInput>(
  input: TInput,
  theme: TTheme
): ComponentsFromSchema<TInput> {
  const visit = (node: unknown): unknown => {
    if (typeof node === 'function') {
      return (node as (t: TTheme) => string)(theme);
    }

    if (Array.isArray(node)) {
      return node.map(visit);
    }

    if (isPlainObject(node)) {
      // @ts-expect-error - We know this is an object
      return mapValues(node, visit);
    }

    return node;
  };

  return visit(input) as ComponentsFromSchema<TInput>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;

/**
 * Flattens component entries that contain a `vars` section.
 * @param input The components object to flatten.
 * @returns A flattened components object where entries with a `vars` property are replaced
 * by their `vars` content.
 * @example
 * { price: { vars: { color: 'red' } } }
 *
 * becomes:
 * { price: { color: 'red' } }
 */
export function flattenComponentVars<T extends AnyObject>(input: T) {
  const result: AnyObject = {};

  for (const [key, value] of Object.entries(input)) {
    if (value && typeof value === 'object' && 'vars' in value) {
      result[key] = {
        ...(value as AnyObject).vars,
      };
    } else {
      result[key] = value;
    }
  }

  return result as {
    [K in keyof T]: T[K] extends { vars: infer V } ? V : T[K];
  };
}

/**
 * Creates a components object from the theme
 * @param inputComponents The input components options
 * @returns The components object
 */
const createComponents = (inputComponents: ComponentsOptions): Components => {
  const mergedComponents = merge(
    {},
    componentsSchema,
    componentsDefaults,
    inputComponents
  ) as Components;
  return mergedComponents;
};

export default createComponents;
