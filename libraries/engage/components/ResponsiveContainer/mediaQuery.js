import { hasWebBridge } from '@shopgate/engage/core';
import breakpoints from './breakpoints';

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
export const responsiveMediaQuery = (breakpoint, { appOnly = false, webOnly = false }) => {
  // Parse breakpoint prop into the comparator and the breakpoint name.
  const breakpointStart = breakpoint.search(/[a-zA-Z]/);
  const comparatorString = breakpoint.substring(0, breakpointStart === -1 ? 0 : breakpointStart);
  const breakpointString = breakpoint.substring(breakpointStart === -1 ? 0 : breakpointStart);

  // Get configuration.
  const comparator = comparators[comparatorString];
  const config = breakpoints.find(b => b.name === breakpointString);

  // Web / App config.
  const isWeb = hasWebBridge();

  // Return media query that never evaluates for now.
  if ((appOnly && isWeb) || (webOnly && !isWeb)) {
    return '@media (height = 0)';
  }

  return comparator(config.from, config.to);
};
