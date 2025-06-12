import { useState, useEffect } from 'react';
import useTheme from './useTheme';

/**
 * React hook to check if a media query matches the current viewport.
 * Doesn't accept media query strings that start with '@media'.
 * @param {string} query A media query string, e.g. '(min-width: 600px)'
 * @returns {boolean} Returns true if the media query matches, false otherwise.
 */
const useMediaQueryInternal = (query) => {
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
 * @typedef {import('./useTheme').Theme} Theme
 */

/**
 * @callback ThemeFn
 * @param {Theme} theme The current theme object.
 */

/**
 * Creates a media query hook that can be used to check if a media query matches the current
 * viewport.
 * @param {string|ThemeFn} queryInput The media query string or a function that receives the theme
 * and returns a media query string.
 * @returns {boolean} Returns true if the media query matches, false otherwise.
 */
const useMediaQuery = (queryInput) => {
  const theme = useTheme();

  let query = typeof queryInput === 'function' ? queryInput(theme) : queryInput;
  // Remove the '@media' prefix if it exists, as useMediaQueryInternal expects a plain media query.
  query = query.replace(/^@media( ?)/m, '');

  const match = useMediaQueryInternal(query);
  return match;
};

export default useMediaQuery;
