/**
 * Tests if the prop is an array-object.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isArray = prop => (
  (typeof prop === 'object') && (prop !== null) && (prop.constructor === Array)
);

/**
 * Tests if the prop is an object.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isObject = prop => (
  (typeof prop === 'object') && (prop !== null) && (prop.constructor === Object)
);

/**
 * Checks if a passed value is numeric.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isNumeric = prop => (
  // eslint-disable-next-line no-restricted-globals
  !Number.isNaN(parseFloat(prop)) && isFinite(prop)
);

/**
 * Tests if the prop is a number.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isNumber = prop => (
  // eslint-disable-next-line no-restricted-globals
  (typeof prop === 'number') && isFinite(prop)
);

/**
 * Tests if the prop is an integer.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isInteger = prop => (
  isNumber(prop) && prop % 1 === 0
);

/**
 * Tests if the prop is boolean.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isBoolean = prop => (
  typeof prop === 'boolean'
);

/**
 * Tests if the prop is function.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isFunction = prop => (
  typeof prop === 'function'
);

/**
 * Tests if the prop is undefined.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isUndefined = prop => (
  typeof prop === 'undefined'
);

/**
 * Tests if the prop is a promise.
 * @param {*} prop The property to test.
 * @return {boolean}
 */
export const isPromise = prop => (
  prop !== null &&
   (typeof prop === 'object' || typeof prop === 'function') &&
    typeof prop.then === 'function'
);
