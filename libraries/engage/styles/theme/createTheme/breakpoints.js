/**
 * @typedef {'xs' | 'sm' | 'md' | 'lg' | 'xl'} BreakpointKey
 */

/** @type {{ [key in BreakpointKey]: number }} */
const breakpointsValues = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

/**
 * @type {{
 *   values: typeof breakpointsValues,
 *   up: (key: BreakpointKey) => string,
 *   down: (key: BreakpointKey) => string,
 *   between: (start: BreakpointKey, end: BreakpointKey) => string
 * }}
 */
export const breakpoints = {
  values: breakpointsValues,
  up: key => `@media (min-width:${breakpointsValues[key]}px)`,
  down: key => `@media (max-width:${breakpointsValues[key] - 0.05}px)`,
  between: (start, end) =>
    `@media (min-width:${breakpointsValues[start]}px) and (max-width:${
      breakpointsValues[end] - 0.05
    }px)`,
};

