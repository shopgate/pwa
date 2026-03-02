import { useState, useEffect } from 'react';
import useTheme from './useTheme';
import { type Theme } from '..';

/**
 * React hook to check if a media query matches the current viewport.
 * Doesn't accept media query strings that start with '@media'.
 * @param query A media query string, e.g. '(min-width: 600px)'
 * @returns Returns true if the media query matches, false otherwise.
 */
const useMediaQueryInternal = (query: string): boolean => {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const queryList = window.matchMedia(query);
    /**
     * Update the match state when the media query changes.
     */
    const updateMatch = () => {
      setMatch(queryList.matches);
    };

    queryList.addEventListener('change', updateMatch);

    return () => {
      queryList.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return match;
};

/**
 * @callback ThemeFn
 * @param {Theme} theme The current theme object.
 */

/**
 * Creates a media query hook that can be used to check if a media query matches the current
 * viewport.
 * @param queryInput The media query string or a function that receives the theme
 * and returns a media query string.
 * @returns Returns true if the media query matches, false otherwise.
 * @example Use the useTheme hook to get access to the breakpoint helper functions:
 * ```js
 * import React from 'react';
 * import { useTheme, useMediaQuery } from '@shopgate/engage/styles';
 * export default function MyComponent() {
 *   const theme = useTheme();
 *   const matches = useMediaQuery(theme.breakpoints.up('sm'));
 *   return (<span>{`theme.breakpoints.up('sm') matches: ${matches}`}</span>)
 * }
 *```
 * @example Alternatively, you can use a callback function, accepting the theme as a first argument:
 * ```js
 * import React from 'react';
 * import { useMediaQuery } from '@shopgate/engage/styles';
 *
 * export default function MyComponent() {
 *   const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));
 *
 *   return (<span>{`theme.breakpoints.up('sm') matches: ${matches}`}</span>)
 * }
 */
const useMediaQuery = (queryInput: string | ((theme: Theme) => string)): boolean => {
  const theme = useTheme();

  let query = typeof queryInput === 'function' ? queryInput(theme) : queryInput;
  // Remove the '@media' prefix if it exists, as useMediaQueryInternal expects a plain media query.
  query = query.replace(/^@media( ?)/m, '');

  const match = useMediaQueryInternal(query);
  return match;
};

export default useMediaQuery;
