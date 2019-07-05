import { main$ } from './main';
import {
  NAVIGATE,
  ROUTE_WILL_ENTER,
  ROUTE_DID_ENTER,
  ROUTE_WILL_LEAVE,
  ROUTE_DID_LEAVE,
  ROUTE_DID_UPDATE,
} from '../constants/ActionTypes';

/**
 * @type {Observable}
 */
export const navigate$ = main$
  .filter(({ action }) => action.type === NAVIGATE);

/**
 * @type {Observable}
 */
export const routeWillEnter$ = main$
  .filter(({ action }) => action.type === ROUTE_WILL_ENTER);

/**
 * @type {Observable}
 */
export const routeDidEnter$ = main$
  .filter(({ action }) => action.type === ROUTE_DID_ENTER);

/**
 * @type {Observable}
 */
export const routeWillLeave$ = main$
  .filter(({ action }) => action.type === ROUTE_WILL_LEAVE);

/**
 * @type {Observable}
 */
export const routeDidLeave$ = main$
  .filter(({ action }) => action.type === ROUTE_DID_LEAVE);

/**
 * @type {Observable}
 */
export const routeDidUpdate$ = main$
  .filter(({ action }) => action.type === ROUTE_DID_UPDATE);

/**
 * @type {Observable}
 * @deprecated use routeDidEnter$
 */
export const routeDidChange$ = routeWillEnter$
  .merge(routeDidEnter$)
  .merge(routeWillLeave$)
  .merge(routeDidLeave$)
  .merge(routeDidUpdate$);
