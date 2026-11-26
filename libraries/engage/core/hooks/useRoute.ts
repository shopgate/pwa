import { useContext } from 'react';
import type { Route } from '@virtuous/conductor';
import { RouteContext } from '@shopgate/pwa-common/context';

/**
 * The route a component renders in, as the route context provides it.
 */
export interface RouteContextValue extends Route {
  /**
   * Whether the route is part of the history stack.
   */
  open: boolean;
  /**
   * Whether the route is the one that is currently shown.
   */
  visible: boolean;
}

/**
 * Provides the route the component renders in.
 * @returns The route.
 */
export function useRoute(): RouteContextValue {
  return useContext(RouteContext) as RouteContextValue;
}
