import { hasWebBridge } from '@shopgate/engage/core';

/* eslint-disable extra-rules/no-single-line-objects */
const breakpoints = [
  { name: 'xs', from: 0, to: 600 },
  { name: 'sm', from: 600, to: 960 },
  { name: 'md', from: 960, to: 1280 },
  { name: 'lg', from: 1280, to: 1920 },
  { name: 'xl', from: 1920, to: Number.MAX_VALUE },
];
/* eslint-enable extra-rules/no-single-line-objects */

/**
 * Generates a media query for different breakpoints and platform.
 * @param {Object} comparators Comparators.
 * @param {string} breakpoint Breakpoint rule.
 * @param {Object} params Parameters needed to generation.
 * @returns {string}
 */
export const parser = (comparators, breakpoint, {
  appAlways = false,
  appOnly = false,
  webOnly = false,
  webAlways = false,
} = {}) => {
  // Parse breakpoint prop into the comparator and the breakpoint name.
  const breakpointStart = breakpoint.search(/[a-zA-Z]/);
  const comparatorString = breakpoint.substring(0, breakpointStart === -1 ? 0 : breakpointStart);
  const breakpointString = breakpoint.substring(breakpointStart === -1 ? 0 : breakpointStart);

  // Get configuration.
  const comparator = comparators[comparatorString];
  const config = breakpoints.find(b => b.name === breakpointString);

  // Web / App config.
  const isWeb = hasWebBridge();

  // Always mode.
  if ((webAlways && isWeb) || (appAlways && !isWeb)) {
    return true;
  }

  // Return media query that never evaluates for now.
  if ((appOnly && isWeb) || (webOnly && !isWeb)) {
    return false;
  }

  return comparator(config.from, config.to, window.innerWidth);
};

export default breakpoints;
