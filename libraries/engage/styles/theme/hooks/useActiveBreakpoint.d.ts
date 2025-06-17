import { Breakpoint } from '..';

/**
 * Returns the active breakpoint for the current window size.
 *
 * @example
 * ```js
 * import React from 'react';
 * import { useActiveBreakpoint } from '@shopgate/engage/styles';
 *
 * export default function MyComponent() {
 *   const activeBreakpoint = useActiveBreakpoint();
 *
 *   return (<span>{`active breakpoint: ${activeBreakpoint}`}</span>)
 * }
 * ```
 */
export default function useActiveBreakpoint(): Breakpoint;
