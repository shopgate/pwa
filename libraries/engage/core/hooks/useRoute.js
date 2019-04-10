import { useContext } from 'react';
import { RouteContext } from '@shopgate/pwa-common/context';

/**
 * Provides the route parameters.
 * @returns {Object}
 */
export function useRoute() {
  const routeContext = useContext(RouteContext);
  return routeContext;
}
