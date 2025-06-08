import React, {
  createContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@shopgate/engage/styles';

/**
 * @typedef {import('..').Breakpoint} Breakpoint
 */

/** @type {import('react').Context<Breakpoint>} */
export const ActiveBreakpointContext = createContext(undefined);

/**
 * @param {Object} props The component props
 * @param {React.ReactNode} props.children The children to render within the provider
 * @returns {JSX.Element} The ActiveBreakpointProvider component
 */
const ActiveBreakpointProvider = ({ children }) => {
  const theme = useTheme();

  // ['xl', 'lg', ..., 'xs']
  const breakpoints = [...theme.breakpoints.keys].reverse();

  /**
   * Retrieve the initial breakpoint based on the current window size.
   * @returns {Breakpoint|undefined} The initial breakpoint based on the current window size.
   */
  const getInitialBreakpoint = () => {
    if (typeof window === 'undefined') return undefined;
    return breakpoints.find(bp =>
      window.matchMedia(theme.breakpoints.up(bp).replace(/^@media( ?)/m, '')).matches);
  };

  /** @type {[Breakpoint, React.Dispatch<React.SetStateAction<Breakpoint>>]} */
  const [active, setActive] = useState(getInitialBreakpoint);

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

ActiveBreakpointProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ActiveBreakpointProvider;
