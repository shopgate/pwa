import { parser } from './breakpoints';

const comparators = {
  '>=': from => `@media (min-width: ${from}px)`,
  '>': (from, to) => `@media (min-width: ${to}px)`,
  '<': from => `@media (max-width: ${from}px)`,
  '<=': (from, to) => `@media (max-width: ${to}px)`,
  '': (from, to) => `@media (min-width: ${from}px) and (max-width: ${to}px)`,
};

/**
 * Generates a media query for different breakpoints and platform.
 * @param {string} breakpoint Breakpoint rule.
 * @param {Object} params Parameters needed to generation.
 * @returns {string}
 */
export const responsiveMediaQuery = (breakpoint, params = {}) => {
  const parsed = parser(comparators, breakpoint, params);

  // Return media query that never evaluates for now.
  if (!parsed) {
    return '@media (height = 0)';
  }

  return parsed;
};
