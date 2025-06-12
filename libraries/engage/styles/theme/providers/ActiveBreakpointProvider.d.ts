import { ReactNode, JSX, Context } from 'react';
import { Breakpoint } from '..';

/**
 * React Context for current active breakpoint.
 */
export const ActiveBreakpointContext: Context<Breakpoint | undefined>;

/**
 * Props for the ActiveBreakpointProvider.
 */
export interface ActiveBreakpointProviderProps {
  children: ReactNode;
}

/**
 * Provides the current active breakpoint to child components.
 */
declare function ActiveBreakpointProvider(props: ActiveBreakpointProviderProps): JSX.Element;

export default ActiveBreakpointProvider;
