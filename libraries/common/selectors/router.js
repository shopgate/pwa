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
 * @returns {string|null} The current history entry.
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
 * @returns {string|null} The current history pathname.
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
 * @returns {string|null} The current history query.
 */
export const getCurrentQuery = createSelector(
  getCurrentRoute,
  (route) => {
    if (!route || !route.query) {
      return null;
    }

    return route.query;
  }
);

/**
 * @param {Object} state The global state.
 * @returns {string|null} The current history search query.
 */
export const getCurrentSearchQuery = createSelector(
  getCurrentQuery,
  (query) => {
    if (!query || !query.s) {
      return null;
    }

    return query.s;
  }
);
