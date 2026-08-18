import { UIEvents } from '@shopgate/pwa-core';
import { router } from '@virtuous/conductor';

export interface NavigationState {
  target?: string;
  [key: string]: unknown;
}

export interface NavigationParams {
  pathname: string;
  state?: NavigationState;
  silent?: boolean;
}

export interface PopParams {
  steps?: number;
  state?: NavigationState;
}

export const NAVIGATION_PUSH = 'navigation.push';
export const NAVIGATION_POP = 'navigation.pop';
export const NAVIGATION_REPLACE = 'navigation.replace';
export const NAVIGATION_RESET = 'navigation.reset';

/**
 * Performs the PUSH navigation action.
 * @param params The history params.
 */
export function push(params: NavigationParams): void {
  UIEvents.emit(NAVIGATION_PUSH, params);
}

/**
 * Performs the POP navigation action.
 * @param params The history params. Pass `steps` to pop more than one route.
 */
export function pop(params?: PopParams): void {
  UIEvents.emit(NAVIGATION_POP, params);
}

/**
 * Performs the REPLACE navigation action.
 * @param params The history params.
 */
export function replace(params: NavigationParams): void {
  UIEvents.emit(NAVIGATION_REPLACE, params);
}

/**
 * Performs the RESET navigation action.
 */
export function reset(): void {
  UIEvents.emit(NAVIGATION_RESET);
}

/**
 * Adds meta state to an existing route.
 * @param state The meta state to merge into the route.
 * @param routeId The ID of the route to update. Defaults to the current route.
 */
export function update(
  state: NavigationState,
  routeId: string = router.getCurrentRoute().id
): void {
  router.update(routeId, state);
}
