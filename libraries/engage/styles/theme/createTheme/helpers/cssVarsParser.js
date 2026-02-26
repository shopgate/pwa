/**
 * @file Helper function to parse a theme-like object to generate matching CSS variables.
 * Heavily inspired by Material UI's implementation:
 * @link https://github.com/mui/material-ui/blob/master/packages/mui-system/src/cssVars/cssVarsParser.ts
 */

/**
 * This function creates an object from keys, value and then assign to target
 *
 * @param {Object} obj The target object to be assigned
 * @param {string[]} keys An array of keys to create the nested object
 * @param {string | number} value The value to be assigned to the deepest key
 * @param {string[]} arrayKeys An array of keys that are arrays, so the function will create
 *  array instead of object when it encounters these keys
 */
export const assignNestedKeys = (
  obj,
  keys,
  value,
  arrayKeys = []
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
      temp = temp[k];
    }
  });
};

/**
 * Walk through an object recursively and call the callback when the deepest key is reached
 * and its value is not `undefined` | `null`.
 * @param {Object} obj Source object
 * @param {Function} callback A function that will be called when
 * - the deepest key in source object is reached
 * - the value of the deepest key is NOT `undefined` | `null`
 * @param {Function} shouldSkipPaths A function that will be called before traversing the object,
 * if it returns true, the current path will be skipped
 */
export const walkObjectDeep = (
  obj,
  callback,
  shouldSkipPaths
) => {
  /* eslint-disable-next-line require-jsdoc */
  function recurse(object, parentKeys = [], arrayKeys = []) {
    Object.entries(object).forEach(([key, value]) => {
      if (!shouldSkipPaths || !shouldSkipPaths([...parentKeys, key])) {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && Object.keys(value).length > 0) {
            recurse(
              value,
              [...parentKeys, key],
              Array.isArray(value) ? [...arrayKeys, key] : arrayKeys
            );
          } else {
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
 * @param {string[]} keys The keys of the value, used to determine if the value is unitless or not
 * @param {string | number} value The value to be converted to a CSS value, if it's a number
 * and not unitless, it will be converted to a string with 'px' unit
 * @returns {string | number}
 */
const getCssValue = (keys, value) => {
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

/**
 * Helper function to parse a theme-like object to generate matching CSS variables.
 * It will return an object containing `css`, `vars`, and `varsWithDefaults`.
 * The `css` object can be used to set CSS variables in a style tag,
 * the `vars` object can be used to reference the CSS variables in the theme,
 * and the `varsWithDefaults` object can be used to reference the CSS variables with fallback
 * values in the theme.
 *
 * @param {Object} theme A theme like object
 * @param {Object} options Options
 *
 * @returns {Object} Returns an object containing `css`, `vars`, and `varsWithDefaults`. Check
 * d.ts file for details.
 */
export default function cssVarsParser(
  theme,
  options
) {
  const {
    prefix = 'sg',
    shouldSkipGeneratingVar,
  } = options || {};
  const css = {};
  const vars = {};
  const varsWithDefaults = {};

  walkObjectDeep(
    theme,
    (keys, value, arrayKeys) => {
      if (typeof value === 'string' || typeof value === 'number') {
        if (!shouldSkipGeneratingVar || !shouldSkipGeneratingVar(keys, value)) {
          // only create css & var if `shouldSkipGeneratingVar` return false
          const cssVar = `--${prefix ? `${prefix}-` : ''}${keys.join('-')}`;
          const resolvedValue = getCssValue(keys, value);

          Object.assign(css, { [cssVar]: resolvedValue });

          assignNestedKeys(vars, keys, `var(${cssVar})`, arrayKeys);
          assignNestedKeys(
            varsWithDefaults,
            keys,
            `var(${cssVar}, ${resolvedValue})`,
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
  };
}
