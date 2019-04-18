import { UIEvents } from '@shopgate/pwa-core';

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
