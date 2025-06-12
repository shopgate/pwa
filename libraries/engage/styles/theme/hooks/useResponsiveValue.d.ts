import { Breakpoint } from '..';

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
export default function useResponsiveValue<const T extends BreakpointValueMap<any>>(
  values: T
): T[keyof T];
