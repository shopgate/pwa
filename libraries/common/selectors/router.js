import { createSelector } from 'reselect';

/**
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getRouterState = state => state.router;

/**
 * @param {Object} state The global state.
 * @return {Object}
 */
export const getRouterStack = state => getRouterState(state).stack;

/**
 * @param {Object} state The global state.
 * @returns {string|null} The current search phrase.
 */
export const getCurrentRoute = createSelector(
  getRouterStack,
  (stack) => {
    if (!stack.length) {
      return null;
    }

    return stack[stack.length - 1];
  }
);

/**
 * @param {Object} state The global state.
 * @returns {string|null} The current search phrase.
 */
export const getCurrentPathname = createSelector(
  getCurrentRoute,
  (route) => {
    if (!route || !route.pathname) {
      return null;
    }

    return route.pathname;
  }
);

/**
 * @param {Object} state The global state.
 * @returns {string|null} The current route state.
 */
export const getCurrentState = createSelector(
  getCurrentRoute,
  (route) => {
    if (!route || !route.state) {
      return null;
    }

    return route.state;
  }
);
