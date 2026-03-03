import merge from 'lodash/merge';
import isPlainObject from 'lodash/isPlainObject';
import mapValues from 'lodash/mapValues';

import type {
  ComponentsOptions,
  Components,
  ComponentsFromSchema,
} from './createComponents.types';
import { componentsDefaults } from './createComponents.types';

export type { ComponentsOptions, Components } from './createComponents.types';

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

/**
 * Creates a components object from the theme
 * @param inputComponents The input components options
 * @returns The components object
 */
const createComponents = (inputComponents: ComponentsOptions): Components => {
  const mergedComponents = merge({}, componentsDefaults, inputComponents) as Components;
  return mergedComponents;
};

export default createComponents;
