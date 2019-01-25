import {
  NAVIGATE,
  ROUTE_WILL_ENTER,
  ROUTE_DID_ENTER,
  ROUTE_WILL_LEAVE,
  ROUTE_DID_LEAVE,
  ROUTE_DID_UPDATE,
} from '../../constants/ActionTypes';

/**
 * Creates the dispatched NAVIGATE action object.
 * @param {Object} params The history params.
 * @param {string} params.action The history action.
 * @param {string} params.pathname The history pathname.
 * @param {boolean} params.silent Whether or not to navigate silently (no events).
 * @param {Object} params.state The history state.
 * @param {number} params.steps The number of steps to navigate by.
 * @return {Object} The dispatched action object.
 */
export const navigate = params => ({
  type: NAVIGATE,
  params,
});

/**
 * Creates the dispatched ROUTE_WILL_ENTER action object.
 * @param {Object} route The route object.
 * @param {string} historyAction The history action.
 * @return {Object} The dispatched action object.
 */
export const routeWillEnter = (route, historyAction) => ({
  type: ROUTE_WILL_ENTER,
  route,
  historyAction,
});

/**
 * Creates the dispatched ROUTE_DID_ENTER action object.
 * @param {Object} route The route object.
 * @param {string} historyAction The history action.
 * @return {Object} The dispatched action object.
 */
export const routeDidEnter = (route, historyAction) => ({
  type: ROUTE_DID_ENTER,
  route,
  historyAction,
});

/**
 * Creates the dispatched ROUTE_WILL_LEAVE action object.
 * @param {Object} route The route object.
 * @param {string} historyAction The history action.
 * @return {Object} The dispatched action object.
 */
export const routeWillLeave = (route, historyAction) => ({
  type: ROUTE_WILL_LEAVE,
  route,
  historyAction,
});

/**
 * Creates the dispatched ROUTE_DID_LEAVE action object.
 * @param {Object} route The route object.
 * @param {string} historyAction The history action.
 * @return {Object} The dispatched action object.
 */
export const routeDidLeave = (route, historyAction) => ({
  type: ROUTE_DID_LEAVE,
  route,
  historyAction,
});

/**
 * Creates the dispatched ROUTE_DID_UPDATE action object.
 * @param {Object} route The route object.
 * @param {string} historyAction The history action.
 * @return {Object} The dispatched action object.
 */
export const routeDidUpdate = (route, historyAction) => ({
  type: ROUTE_DID_UPDATE,
  route,
  historyAction,
});
