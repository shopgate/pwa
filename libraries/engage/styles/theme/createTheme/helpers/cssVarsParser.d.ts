// cssVarsParser.d.ts

export type NestedRecord<V = any> = {
  [k: string | number]: NestedRecord<V> | V;
};

/**
 * This function creates an object from keys, value and then assign to target
 *
 * @param {Object} obj The target object to be assigned
 * @param {string[]} keys An array of keys to create the nested object
 * @param {string | number} value The value to be assigned to the deepest key
 * @param {string[]} arrayKeys An array of keys that are arrays, so the function will create
 *  array instead of object when it encounters these keys
 *
 * @example
 * const source = {}
 * assignNestedKeys(source, ['palette', 'primary'], 'var(--palette-primary)')
 * console.log(source) // { palette: { primary: 'var(--palette-primary)' } }
 *
 * @example
 * const source = { palette: { primary: 'var(--palette-primary)' } }
 * assignNestedKeys(source, ['palette', 'secondary'], 'var(--palette-secondary)')
 * console.log(source) // { palette: { primary: 'var(--palette-primary)', secondary: 'var(--palette-secondary)' } }
 */
export declare const assignNestedKeys: <
  T extends Record<string, any> | null | undefined | string = NestedRecord,
  Value = any,
>(
  obj: T,
  keys: Array<string>,
  value: Value,
  arrayKeys?: Array<string>
) => void;

/**
 * Walk through an object recursively and call the callback when the deepest key is reached
 * and its value is not `undefined` | `null`.
 * @param {Object} obj Source object
 * @param {Function} callback A function that will be called when
 * - the deepest key in source object is reached
 * - the value of the deepest key is NOT `undefined` | `null`
 * @param {Function} shouldSkipPaths A function that will be called before traversing the object,
 * if it returns true, the current path will be skipped
 *
 * @example
 * walkObjectDeep({ palette: { primary: { main: '#000000' } } }, console.log)
 * // ['palette', 'primary', 'main'] '#000000'
 */
export declare const walkObjectDeep: <Value, T = Record<string, any>>(
  obj: T,
  callback: (keys: Array<string>, value: Value, arrayKeys: Array<string>) => void,
  shouldSkipPaths?: (keys: Array<string>) => boolean
) => void;

/**
 * Helper function to parse a theme-like object to generate matching CSS variables.
 * It will return an object containing `css`, `vars`, and `varsWithDefaults`.
 * The `css` object can be used to set CSS variables in a style tag,
 * the `vars` object can be used to reference the CSS variables in the theme,
 * and the `varsWithDefaults` object can be used to reference the CSS variables with fallback
 * values in the theme.
 *
 * @param {Object} theme
 * @param {{
 *  prefix?: string,
 *  shouldSkipGeneratingVar?: (objectPathKeys: Array<string>, value: string | number) => boolean
 * }} options.
 *  `prefix`: The prefix of the generated CSS variables. This function does not change the value.
 *
 * @returns {{ css: Object, vars: Object, varsWithDefaults: Object }} `css` is the stylesheet, `vars` is an object to get css variable (same structure as theme), `varsWithDefaults` is an object to get css variable with fallback values (same structure as theme).
 *
 * @example
 * const { css, vars } = parser({
 *   fontSize: 12,
 *   lineHeight: 1.2,
 *   palette: { primary: { 500: 'var(--color)' } }
 * }, { prefix: 'foo' })
 *
 * console.log(css) // { '--foo-fontSize': '12px', '--foo-lineHeight': 1.2, '--foo-palette-primary-500': 'var(--color)' }
 * console.log(vars) // { fontSize: 'var(--foo-fontSize)', lineHeight: 'var(--foo-lineHeight)', palette: { primary: { 500: 'var(--foo-palette-primary-500)' } } }
 */
export default function cssVarsParser<T extends Record<string, any>>(
  theme: Record<string, any>,
  options?: {
    prefix?: string | undefined;
    shouldSkipGeneratingVar?:
      | ((objectPathKeys: Array<string>, value: string | number) => boolean)
      | undefined;
  }
): {
  css: Record<string, string | number>;
  vars: T;
  varsWithDefaults: Record<string, any>;
};
