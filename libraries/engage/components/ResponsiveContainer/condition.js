import { parser } from './breakpoints';

const comparators = {
  '>=': (from, to, width) => width >= from,
  '>': (from, to, width) => width >= to,
  '<': (from, to, width) => width <= from,
  '<=': (from, to, width) => width <= to,
  '': (from, to, width) => width >= from && width <= to,
};

/**
 * Tests if responsive condition applies.
 * @param {string} breakpoint Breakpoint rule.
 * @param {Object} params Parameters needed to generation.
 * @returns {string}
 */
export const responsiveCondition = (breakpoint, params = {}) => {
  const parsed = parser(comparators, breakpoint, params);
  return parsed;
};
