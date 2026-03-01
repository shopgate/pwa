import useTheme from './useTheme';
import useActiveBreakpoint from './useActiveBreakpoint';
import type { Breakpoint } from '../createTheme';

type BreakpointValueMap<T> = Partial<Record<Breakpoint, T>>;

/**
 * Returns the value for the current breakpoint based on the provided responsive values object.
 * It is also responsive to window resizing and returning the appropriate value according to the
 * new window size.
 * @param values The responsive values object
 * @example
 * ```js
 * import React from 'react';
 * import { useResponsiveValue } from '@shopgate/engage/styles';
 *
 * export default function MyComponent() {
 *   const flexDir = useResponsiveValue({
 *     xs: "column",
 *     lg: "row"
 *   });
 *
 *   return (<span style={{ display: 'flex', flexDirection: flexDir }} />)
 * }
 * ```
 */
const useResponsiveValue = <const T extends BreakpointValueMap<unknown>>(
  values: T
): T[keyof T] | undefined => {
  const theme = useTheme();
  const active = useActiveBreakpoint();

  if (!active) return undefined;

  // Get the keys of the breakpoints in the theme
  const breakpoints = [...theme.breakpoints.keys];
  const activeIndex = breakpoints.indexOf(active);

  // Walk from the active breakpoint down to smallest
  for (let i = activeIndex; i >= 0; i -= 1) {
    const bp = breakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp] as T[keyof T];
    }
  }

  return undefined;
};

export default useResponsiveValue;
