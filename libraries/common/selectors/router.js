import { createSelector } from 'reselect';
import { isObject } from '../helpers/validation';
import authRoutes from '../collections/AuthRoutes';

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

/**
 * Determines, if a router state entry is the last entry in the stack.
 * @param {string} id The id of the entry.
 * @returns {Function}
 */
export function makeIsLastStackEntry() {
  return createSelector(
    (state, props = {}) => props.routeId,
    getRouterStack,
    (routeId, stack) => {
      const index = stack.findIndex(entry => entry.id === routeId);
      return index >= 0 && index === stack.length - 1;
    }
  );
}

/**
 * Get the previous route from stack.
 * @returns {Function}
 */
export function makeGetPrevRoute() {
  return createSelector(
    (state, props = {}) => props.routeId,
    getRouterStack,
    (routeId, stack) => {
      const routeIndex = stack.findIndex(entry => entry.id === routeId);
      if (routeIndex <= 0) {
        return null;
      }
      return stack[routeIndex - 1];
    }
  );
}

/**
 * Creates a selector that retrieves the pattern of the route.
 * @returns {Function}
 */
export const makeGetRoutePattern = () =>
  /**
   * Retrieves the route pattern.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {string|null} The pattern.
   */
  createSelector(
    getCurrentRoute,
    (route) => {
      if (!route || !route.pattern) {
        return null;
      }

      return route.pattern;
    }
  );

/**
 * Creates a selector that retrieves the value of a specific parameter from the route.
 * @param {string} name The name of the desired parameter.
 * @returns {Function}
 */
export const makeGetRouteParam = (name = '') =>
  /**
   * Retrieves a parameter from the route.
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {string|null} The parameter value.
   */
  createSelector(
    getCurrentParams,
    (params) => {
      if (!isObject(params)) {
        return null;
      }

      return params[name] || null;
    }
  );

/**
 * Creates a selector that retrieves the index of the current or a specific route when passed
 * within the props.
 * @returns {number|null}
 */
export const getRouterStackIndex = createSelector(
  getRouterStack,
  getCurrentRoute,
  (routerStack, currentRoute) => {
    if (!currentRoute) {
      return null;
    }

    const { id: currentId } = currentRoute;
    const index = routerStack.findIndex(({ id }) => currentId === id);
    return index >= 0 ? index : null;
  }
);

/**
 * Creates a selector that retrieves the index of the most next previous route with
 * the desired pattern within the stack
 * @param {string} pattern The desired route pattern
 * @returns {Function}
 */
export const makeGetPrevRouteIndexByPattern = pattern =>
  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object} The route.
   */
  createSelector(
    getRouterStack,
    getRouterStackIndex,
    (routerStack, routerStackIndex) => {
      const sliced = routerStack.slice(0, routerStackIndex);
      const reversedIndex = sliced.reverse().findIndex(route => route.pattern === pattern);
      return reversedIndex === -1 ? reversedIndex : sliced.length - 1 - reversedIndex;
    }
  );

/**
 * Creates a selector to determine if the current active route is "protected" (needs login).
 * @returns {Function}
 */
export const makeGetIsCurrentRouteProtected = () => createSelector(
  getCurrentPathname,
  pattern => !!authRoutes.getProtector(pattern)
);
