import { useContext } from 'react';
import { ThemeContext, RouteContext } from '@shopgate/pwa-common/context';

/**
 * Gives the ability to access the theme and route context via a single hook.
 * Example Usage:
 * ```js
 * const { View, AppBar, params } = useCustomRoute();
 * ```
 * @returns {Object}
 */
export function useCustomRoute() {
  const themeContext = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);

  return {
    ...themeContext,
    ...routeContext,
  };
}
