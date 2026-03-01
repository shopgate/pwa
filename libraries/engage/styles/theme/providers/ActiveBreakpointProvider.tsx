import {
  createContext, useEffect, useState, memo,
} from 'react';
import { useTheme } from '@shopgate/engage/styles';
import { type Breakpoint } from '..';

export const ActiveBreakpointContext = createContext<Breakpoint | undefined>('' as Breakpoint);

type ActiveBreakpointProviderProps = {
  children: React.ReactNode;
};

/**
 * Provides the current active breakpoint to child components.
 * @param props The component props
 * @returns The ActiveBreakpointProvider component
 */
const ActiveBreakpointProvider = ({ children }: ActiveBreakpointProviderProps) => {
  const theme = useTheme();

  // ['xl', 'lg', ..., 'xs']
  const breakpoints = [...theme.breakpoints.keys].reverse();

  /**
   * Returns the initial active breakpoint based on the current window size.
   */
  const getInitialBreakpoint = () => {
    if (typeof window === 'undefined') return undefined;
    return breakpoints.find(bp =>
      window.matchMedia(theme.breakpoints.up(bp).replace(/^@media( ?)/m, '')).matches);
  };

  const [active, setActive] = useState<Breakpoint | undefined>(getInitialBreakpoint);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const queries = breakpoints.map(bp => ({
      bp,
      mql: window.matchMedia(theme.breakpoints.up(bp).replace(/^@media( ?)/m, '')),
    }));

    /**
     * Updates the active breakpoint based on the current media query matches.
     */
    const update = () => {
      const matched = queries.find(({ mql }) => mql.matches);
      setActive(matched?.bp);
    };

    queries.forEach(({ mql }) => mql.addEventListener('change', update));
    return () => queries.forEach(({ mql }) => mql.removeEventListener('change', update));
  }, [breakpoints, theme]);

  return (
    <ActiveBreakpointContext.Provider value={active}>
      {children}
    </ActiveBreakpointContext.Provider>
  );
};

export default memo(ActiveBreakpointProvider);
