/* eslint-disable valid-jsdoc */

// Possible breakpoints for responsive design
/** @type {import('./createBreakpoints').Breakpoint[]} */
export const breakpointKeys = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * Sorts an object of breakpoints by their numeric values in ascending order.
 *
 * This is useful in responsive design systems to ensure breakpoints
 * are applied in the correct order.
 *
 * @param {Object.<string, number>} values - An object where keys are breakpoint names
 * (e.g., 'xs', 'sm', 'md') and values are numeric pixel values.
 * @returns {Object.<string, number>} A new object with the same key-value pairs, sorted by
 * ascending numeric values.
 *
 * @example
 * const breakpoints = { md: 960, xs: 0, sm: 600 };
 * const sorted = sortBreakpointsValues(breakpoints);
 * console.log(sorted); // { xs: 0, sm: 600, md: 960 }
 */
const sortBreakpointsValues = (values) => {
  const breakpointsAsArray = Object.keys(values).map(key => ({
    key,
    val: values[key],
  })) || [];
  breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
  return breakpointsAsArray.reduce((acc, obj) => ({
    ...acc,
    [obj.key]: obj.val,
  }), {});
};

const unit = 'px';
const step = 5;

/**
 * Creates a set of media query functions based on the provided breakpoints.
 */
const createBreakpoints = () => {
  /** @type {import('./createBreakpoints').Breakpoints['values']} */
  const values = {
    // Extra small – all mobile phones
    xs: 0,
    // Small – large phones in landscape
    sm: 480,
    // Medium – tablets
    md: 768,
    // Large – small laptops
    lg: 1024,
    // Extra large – desktops
    xl: 1280,
  };

  const sortedValues = sortBreakpointsValues(values);
  const keys = Object.keys(sortedValues);

  /**
   * @param {import('./createBreakpoints').Breakpoint | number} key Breakpoint key or pixel value
   * @returns {string} A media query string for the specified breakpoint
   */
  function up(key) {
    const value = typeof values[key] === 'number' ? values[key] : key;
    return `@media (min-width:${value}${unit})`;
  }

  /**
   * @param {import('./createBreakpoints').Breakpoint | number} key Breakpoint key or pixel value
   * @returns {string} A media query string for the specified breakpoint
   */
  function down(key) {
    /** @type {number} */
    const value = typeof values[key] === 'number' ? values[key] : key;
    return `@media (max-width:${value - step / 100}${unit})`;
  }

  /**
   * @param {import('./createBreakpoints').Breakpoint | number} start Breakpoint key or pixel value
   * @param {import('./createBreakpoints').Breakpoint | number} end Breakpoint key or pixel value
   * @returns {string} A media query string for the specified breakpoint
   */
  function between(start, end) {
    const endIndex = keys.indexOf(end);

    return (
      `@media (min-width:${
        typeof values[start] === 'number' ? values[start] : start
      }${unit}) and ` +
      `(max-width:${
        (endIndex !== -1 && typeof values[keys[endIndex]] === 'number'
          ? values[keys[endIndex]]
          : end) -
        step / 100
      }${unit})`
    );
  }

  /**
   * @param {import('./createBreakpoints').Breakpoint} key Breakpoint key or pixel value
   * @returns {string} A media query string for the specified breakpoint
   */
  function only(key) {
    if (keys.indexOf(key) + 1 < keys.length) {
      return between(key, keys[keys.indexOf(key) + 1]);
    }

    return up(key);
  }

  /**
   * @param {import('./createBreakpoints').Breakpoint} key Breakpoint key or pixel value
   * @returns {string} A media query string for the specified breakpoint
   */
  function not(key) {
    // handle first and last key separately, for better readability
    const keyIndex = keys.indexOf(key);
    if (keyIndex === 0) {
      return up(keys[1]);
    }
    if (keyIndex === keys.length - 1) {
      return down(keys[keyIndex]);
    }

    return between(key, keys[keys.indexOf(key) + 1]).replace('@media', '@media not all and');
  }

  return {
    keys,
    values: sortedValues,
    up,
    down,
    between,
    only,
    not,
  };
};

export default createBreakpoints;

/* eslint-enable valid-jsdoc */
