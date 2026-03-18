/**
 * @file Helper function to parse a theme-like object to generate matching CSS variables.
 * Heavily inspired by Material UI's implementation:
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-system/src/cssVars/cssVarsParser.ts
 */

type NestedRecord<V = unknown> = {
  [k: string | number]: NestedRecord<V> | V;
};

/**
 * This function creates an object from keys, value and then assign to target
 *
 * @param obj The target object to be assigned
 * @param keys An array of keys to create the nested object
 * @param value The value to be assigned to the deepest key
 * @param arrayKeys An array of keys that are arrays, so the function will create
 * array instead of object when it encounters these keys
 * @example
 * const source = {}
 * assignNestedKeys(source, ['palette', 'primary'], 'var(--palette-primary)')
 * console.log(source) // { palette: { primary: 'var(--palette-primary)' } }
 * @example
 * const source = { palette: { primary: 'var(--palette-primary)' } }
 * assignNestedKeys(source, ['palette', 'secondary'], 'var(--palette-secondary)')
 * console.log(source) // { palette: { primary: 'var(--palette-primary)', secondary: 'var(--palette-secondary)' } }
 */
const assignNestedKeys = <
  T extends Record<string, unknown> | null | undefined | string = NestedRecord,
  Value = unknown,
>(
    obj: T,
    keys: string[],
    value: Value,
    arrayKeys: string[] = []
  ) => {
  let temp = obj;

  keys.forEach((k, index) => {
    if (index === keys.length - 1) {
      if (Array.isArray(temp)) {
        temp[Number(k)] = value;
      } else if (temp && typeof temp === 'object') {
        temp[k] = value;
      }
    } else if (temp && typeof temp === 'object') {
      if (!temp[k]) {
        temp[k] = arrayKeys.includes(k) ? [] : {};
      }
      // @ts-expect-error - We are sure about the type here
      temp = temp[k];
    }
  });
};

/**
 * Walk through an object recursively and call the callback when the deepest key is reached
 * and its value is not `undefined` | `null`.
 * @param obj Source object
 * @param callback A function that will be called when
 * - the deepest key in source object is reached
 * - the value of the deepest key is NOT `undefined` | `null`
 * @param shouldSkipPaths A function that will be called before traversing the object,
 * if it returns true, the current path will be skipped
 * @example
 * walkObjectDeep({ palette: { primary: { main: '#000000' } } }, console.log)
 * // ['palette', 'primary', 'main'] '#000000'
 */
const walkObjectDeep = <Value, T = Record<string, unknown>>(
  obj: T,
  callback: (keys: Array<string>, value: Value, arrayKeys: Array<string>) => void,
  shouldSkipPaths?: (keys: Array<string>) => boolean
) => {
  function recurse(
    // @ts-expect-error - We are sure about the type here
    object,
    parentKeys = [],
    arrayKeys = []
  ) {
    Object.entries(object).forEach(([key, value]) => {
      if (!shouldSkipPaths || !shouldSkipPaths([...parentKeys, key])) {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && Object.keys(value).length > 0) {
            recurse(
              value,
              // @ts-expect-error - We are sure about the type here
              [...parentKeys, key],
              Array.isArray(value) ? [...arrayKeys, key] : arrayKeys
            );
          } else {
            // @ts-expect-error - We are sure about the type here
            callback([...parentKeys, key], value, arrayKeys);
          }
        }
      }
    });
  }

  recurse(obj);
};

/**
 * Get CSS value with unit if needed. For example, if the value is a number and the key is not
 * unitless, it will add 'px' unit to the value.
 * @param keys The keys of the value, used to determine if the value is unitless or not
 * @param value The value to be converted to a CSS value, if it's a number
 * and not unitless, it will be converted to a string with 'px' unit
 * @returns The CSS value with unit if needed
 */
const getCssValue = (keys: string[], value: string | number) => {
  if (typeof value === 'number') {
    if (['lineHeight', 'fontWeight', 'opacity', 'zIndex'].some(prop => keys.includes(prop))) {
      // CSS property that are unitless
      return value;
    }

    const lastKey = keys[keys.length - 1];
    if (lastKey.toLowerCase().includes('opacity')) {
      // opacity values are unitless
      return value;
    }

    return `${value}px`;
  }

  return value;
};

type CssVarsParserOptions = {
  prefix?: string;
  shouldSkipGeneratingVar?: (objectPathKeys: Array<string>, value: string | number) => boolean;
};

export type CssVarsParserReturnValue<T> = {
  /**
   * An object containing the CSS variables as keys and their corresponding values
   * For example: { '--sg-palette-primary-main': '#000000' }
   */
  css: Record<string, string | number>;
  /**
   * An object with the same structure as the input theme, but with values replaced by CSS variable references.
   * For example: { palette: { primary: { main: 'var(--sg-palette-primary-main)' } }
   */
  vars: T;
  /**
   * An object with the same structure as the input theme, but with values replaced by CSS variable references with fallback values.
   * For example: { palette: { primary: { main: 'var(--sg-palette-primary-main, #000000)' } }
   */
  varsWithDefaults: T;
  /**
   * An object with the same structure as the input theme, but with values replaced by the raw CSS variable names.
   * For example: { palette: { primary: { main: '--sg-palette-primary-main' } }
   */
  varNames: T;
};

/**
 * Helper function to parse a theme-like object to generate matching CSS variables.
 * It will return an object containing `css`, `vars`, and `varsWithDefaults`.
 * The `css` object can be used to set CSS variables in a style tag,
 * the `vars` object can be used to reference the CSS variables in the theme,
 * and the `varsWithDefaults` object can be used to reference the CSS variables with fallback
 * values in the theme.
 *
 * @param theme A theme-like object to be parsed
 * @param options Options for parsing the theme
 * @returns `css` is the stylesheet, `vars` is an object to get css variable (same structure as theme), `varsWithDefaults`
 * is an object to get css variable with fallback values (same structure as theme), `varsRaw` is an object to get the raw css
 * variable name (same structure as theme).
 * @example
 * const { css, vars, varsRaw } = parser({
 *   fontSize: 12,
 *   lineHeight: 1.2,
 *   palette: { primary: { 500: 'var(--color)' } }
 * }, { prefix: 'foo' })
 *
 * console.log(css) // { '--foo-fontSize': '12px', '--foo-lineHeight': 1.2, '--foo-palette-primary-500': 'var(--color)' }
 * console.log(vars) // { fontSize: 'var(--foo-fontSize)', lineHeight: 'var(--foo-lineHeight)', palette: { primary: { 500: 'var(--foo-palette-primary-500)' } } }
 * console.log(varsRaw) // { fontSize: '--foo-fontSize', lineHeight: '--foo-lineHeight', palette: { primary: { 500: '--foo-palette-primary-500' } } }
 */
export default function cssVarsParser<T extends object>(
  theme: object,
  options?: CssVarsParserOptions
): CssVarsParserReturnValue<T> {
  const {
    prefix = 'sg',
    shouldSkipGeneratingVar,
  } = options || {};
  const css = {};
  const vars: T = {} as T;
  const varsWithDefaults: T = {} as T;
  const varNames: T = {} as T;

  walkObjectDeep(
    theme,
    (keys, value, arrayKeys) => {
      if (typeof value === 'string' || typeof value === 'number') {
        if (!shouldSkipGeneratingVar || !shouldSkipGeneratingVar(keys, value)) {
          // only create css & var if `shouldSkipGeneratingVar` return false
          const cssVar = `--${prefix ? `${prefix}-` : ''}${keys.join('-')}`;
          const resolvedValue = getCssValue(keys, value);

          // Add the current css variable to the `css` object (--varName: value)
          Object.assign(css, { [cssVar]: resolvedValue });

          // Add the reference to the current css variable to the `vars` object
          // e.g. ({ palette: { primary: { main: 'var(--varName)' } } })
          assignNestedKeys(
            // @ts-expect-error - We are sure about the type here
            vars,
            keys,
            `var(${cssVar})`,
            arrayKeys
          );

          // Add the reference to the current css variable with fallback value to the `varsWithDefaults` object
          // e.g. ({ palette: { primary: { main: 'var(--varName, fallbackValue)' } } })
          assignNestedKeys(
            // @ts-expect-error - We are sure about the type here
            varsWithDefaults,
            keys,
            `var(${cssVar}, ${resolvedValue})`,
            arrayKeys
          );

          // Add the raw css variable name to the `varNames` object
          // e.g. ({ palette: { primary: { main: '--varName' } } })
          assignNestedKeys(
            // @ts-expect-error - We are sure about the type here
            varNames,
            keys,
            cssVar,
            arrayKeys
          );
        }
      }
    },
    keys => keys[0] === 'vars' // skip 'vars/*' paths
  );

  return {
    css,
    vars,
    varsWithDefaults,
    varNames,
  };
}
