import { UIEvents } from '@shopgate/pwa-core';
import { router } from '@virtuous/conductor';

export const NAVIGATION_PUSH = 'navigation.push';
export const NAVIGATION_POP = 'navigation.pop';
export const NAVIGATION_REPLACE = 'navigation.replace';
export const NAVIGATION_RESET = 'navigation.reset';

/**
 * Performs the PUSH navigation action.
 * @param {Object} params The history params.
 */
export function push(params) {
  UIEvents.emit(NAVIGATION_PUSH, params);
}

/**
 * Performs the POP navigation action.
 */
export function pop() {
  UIEvents.emit(NAVIGATION_POP);
}

/**
 * Performs the REPLACE navigation action.
 * @param {Object} params The history params.
 */
export function replace(params) {
  UIEvents.emit(NAVIGATION_REPLACE, params);
}

/**
 * Performs the RESET navigation action.
 * @param {Object} params The history params.
 */
export function reset() {
  UIEvents.emit(NAVIGATION_RESET);
}

/**
 * Performs the UPDATE navigation action.
 * @param {Object} state The meta state to add to a existing route.
 * @param {string} [routeId] The ID of the route to update.
 */
export function update(state, routeId = router.getCurrentRoute().id) {
  router.update(routeId, state);
}
