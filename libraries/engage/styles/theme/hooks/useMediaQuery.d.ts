import { Theme } from '..';

/**
 * Creates a media query hook that can be used to check if a media query matches the current
 * viewport.
 * @param {string|ThemeFn} queryInput The media query string or a function that receives the theme
 * and returns a media query string.
 * @returns {boolean} Returns true if the media query matches, false otherwise.
 *
 * @example Use the useTheme hook to get access to the breakpoint helper functions:
 * ```js
 * import React from 'react';
 * import { useTheme, useMediaQuery } from '@shopgate/engage/styles';
 *
 * export default function MyComponent() {
 *   const theme = useTheme();
 *   const matches = useMediaQuery(theme.breakpoints.up('sm'));
 *
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
export default function useMediaQuery(queryInput: string | ((theme: Theme) => string)): boolean;
