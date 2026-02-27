import { DefaultColorScheme } from '../'

/**
 * Function that generates a CSS selector string for a given color scheme.
 */
export type GetColorSchemeSelector = (colorScheme: DefaultColorScheme) => string;

/**
 * Function that switches the color scheme by the corresponding selector type.
 */
export type ActiveColorSchemeSwitcher = (colorScheme: DefaultColorScheme) => void;

/**
 * Creates a function that generates a CSS selector string for a given color scheme,
 * based on the specified selector type (either 'data' for data attributes or 'class' for class names).
 *
 * @param selectorType The type of selector to be used, either 'data' for data attributes or
 * 'class' for class names.
 * @returns A function that generates the corresponding selector string.
 */
export function createGetColorSchemeSelector(
  selectorType: 'data' | 'class'
): GetColorSchemeSelector;

/**
 * Creates a function that switches the color scheme, based on the specified selector type
 * (either 'data' for data attributes or 'class' for class names).
 *
 * @param selectorType The type of selector to be used, either 'data' for data attributes or
 * 'class' for class names.
 * @returns A function that switches the color scheme by the corresponding selector type.
 */
export function createSetActiveColorScheme(
  selectorType: 'data' | 'class'
): ActiveColorSchemeSwitcher;

