import { useState, useMemo, useEffect } from 'react';
import { addListener } from './listener';
import { parser } from './breakpoints';

const comparators = {
  '>=': (from, to, width) => width >= from,
  '>': (from, to, width) => width >= to,
  '<': (from, to, width) => width < from,
  '<=': (from, to, width) => width < to,
  '': (from, to, width) => width >= from && width < to,
};

/**
 * Custom hook to determine the visibility or value based on the current active breakpoint
 * and provided conditions.
 * It listens for changes in the viewport or platform breakpoints and returns a value.
 *
 * @param {string} [breakpoint=">=xs"] - The breakpoint condition to match (e.g., '>=md', '<lg').
 * @param {Object} [options={}] - Additional options for customizing behavior.
 * @param {*} [options.valueMatch=true] - Return value when the provided conditions match.
 * @param {*} [options.valueMiss=false] - Return value when the provided conditions do not match.
 * @param {boolean} [options.webOnly=false] If true, the hook will only match in PWA website mode.
 * @param {boolean} [options.webAlways=false] If true, the hook will always match in PWA website
 * mode regardless of the breakpoint.
 * @param {boolean} [options.appOnly=false] If true, the hook will only match in PWA app mode.
 * @param {boolean} [options.appAlways=false] If true, the hook will always match in PWA app mode,
 * regardless of the breakpoint.
 * @returns {boolean}
 */
export const useResponsiveValue = (breakpoint = '>=xs', options) => {
  const {
    webOnly,
    webAlways,
    appOnly,
    appAlways,
    valueMiss,
    valueMatch,
  } = {
    valueMatch: true,
    valueMiss: false,
    appAlways: false,
    appOnly: false,
    webAlways: false,
    webOnly: false,
    ...options,
  };

  // Active breakpoint used for triggering rerenders on resize.
  const [activeBreakpoint, setActiveBreakpoint] = useState(null);

  // Calculate if we have a match for the conditions
  /* eslint-disable react-hooks/exhaustive-deps */
  const isMatch = useMemo(() => {
    const parsed = parser(comparators, breakpoint, {
      breakpoint,
      webOnly,
      webAlways,
      appOnly,
      appAlways,
    });

    return parsed;
  }, [activeBreakpoint, breakpoint]);
  /* eslint-enable react-hooks/exhaustive-deps */

  // Watch for resize changes.
  useEffect(() => addListener((newBreakpoint) => {
    setActiveBreakpoint(newBreakpoint);
  }), []);

  return isMatch ? valueMatch : valueMiss;
};
