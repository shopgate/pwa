import { useContext } from 'react';
import { ActiveBreakpointContext } from '../providers/ActiveBreakpointProvider';

/**
 * Returns the active breakpoint for the current window size.
 * @returns The name of the active breakpoint, or `null` if no breakpoint is active.
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
const useActiveBreakpoint = () => useContext(ActiveBreakpointContext);

export default useActiveBreakpoint;
