import { createSelector } from 'reselect';

/**
 * @param {Object} state The application state.
 * @return {Object}
 */
export const getRouterState = state => state.router;

/**
 * @param {Object} state The application state.
 * @return {Array}
 */
export const getRouterStack = createSelector(
  getRouterState,
  state => (state && state.stack ? state.stack : [])
);

/**
 * @param {Object} state The application state.
 * @returns {Object|null}
 */
export const getCurrentRoute = createSelector(
  getRouterState,
  getRouterStack,
  (state, props = {}) => props.routeId,
  (router, stack, routeId) => {
    if (!router || !router.currentRoute) {
      return null;
    }

    if (!routeId) {
      return router.currentRoute;
    }

    return stack.find(entry => entry.id === routeId);
  }
);

/**
 * @param {Object} state The application state.
 * @returns {Object|null}
 */
export const getCurrentParams = createSelector(
  getCurrentRoute,
  (route) => {
    if (!route || !route.params) {
      return null;
    }

    return route.params;
  }
);

/**
 * @param {Object} state The application state.
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
 * @param {Object} state The application state.
 * @returns {Object|null} The current history query.
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
 * @param {Object} state The application state.
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

/**
 * @param {Object} state The application state.
 * @returns {string|null} The current history entry state.
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
