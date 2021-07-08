import { main$ } from '@shopgate/pwa-common/streams';
import { Observable } from 'rxjs/Observable';
import { cartReceived$ } from '@shopgate/pwa-common-commerce/cart/streams';
import {
  makeGetRoutePattern,
  getCurrentState,
  getCurrentRoute,
} from '@shopgate/pwa-common/selectors/router';
import { routeWillEnter$ } from '@shopgate/pwa-common/streams/router';
import { ITEM_PATTERN } from '@shopgate/pwa-common-commerce/product/constants';
import { getProductDataById } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { SEARCH_PATTERN } from '@shopgate/pwa-common-commerce/search/constants';
import { CATEGORY_PATTERN } from '@shopgate/pwa-common-commerce/category/constants';
import {
  SUBMIT_RESERVATION_SUCCESS,
  RECEIVE_PRODUCT_LOCATIONS,
  RECEIVE_LOCATIONS,
  SET_USER_SEARCH_COUNTRY_CODE,
  SET_USER_SEARCH_POSTAL_CODE,
  SET_USER_SEARCH_GEOLOCATION,
  SET_STORE_FINDER_SEARCH_RADIUS,
  SELECT_GLOBAL_LOCATION,
  STORE_FINDER_PATTERN, SELECT_LOCATION,
} from './constants';
import { RECEIVE_ORDER_DETAILS } from '../orders/constants';

export const submitReservationSuccess$ = main$
  .filter(({ action }) => action.type === SUBMIT_RESERVATION_SUCCESS);

export const receiveProductLocations$ = main$
  .filter(({ action }) => action.type === RECEIVE_PRODUCT_LOCATIONS);

export const receiveOrderDetails$ = main$
  .filter(({ action }) => action.type === RECEIVE_ORDER_DETAILS);

export const cartReceivedWithROPE$ = cartReceived$
  .filter(({ action: { cart: { cartItems = [] } = {} } }) => (
    cartItems.some(item => item?.fulfillment?.location?.code)
  ));

export const userSearchChanged$ = main$
  .filter(({ action }) =>
    action.type === SET_USER_SEARCH_COUNTRY_CODE ||
    action.type === SET_USER_SEARCH_POSTAL_CODE ||
    action.type === SET_USER_SEARCH_GEOLOCATION ||
    action.type === SET_STORE_FINDER_SEARCH_RADIUS);

export const fulfillmentLocationsReceivedFromProduct$ = receiveProductLocations$
  .switchMap((data) => {
    const { action: { locations } } = data;
    const locationCodes = locations.map(({ code }) => code);

    return Observable.of({
      ...data,
      locationCodes,
    });
  });

export const fulfillmentLocationsReceivedFromCart$ = cartReceivedWithROPE$
  .switchMap((data) => {
    const { action: { cart: { cartItems = [] } = {} } } = data;
    let locationCodes = cartItems.map(item => (
      item?.fulfillment?.location?.code
    )).filter(Boolean);
    locationCodes = Array.from(new Set(locationCodes));

    return Observable.of({
      ...data,
      locationCodes,
    });
  });

export const fulfillmentLocationsReceivedFromOrder$ = receiveOrderDetails$
  .filter(({ action: { order: { lineItems = [] } = {} } }) =>
    lineItems.some(item => item.fulfillmentLocationCode))
  .switchMap((data) => {
    const { action: { order: { lineItems = [] } = {} } } = data;
    let locationCodes = lineItems.map(item => item?.fulfillmentLocationCode).filter(Boolean);
    locationCodes = Array.from(new Set(locationCodes));

    return Observable.of({
      ...data,
      locationCodes,
    });
  });

export const fulfillmentLocationsReceived$ = fulfillmentLocationsReceivedFromCart$
  .merge(fulfillmentLocationsReceivedFromOrder$)
  .merge(fulfillmentLocationsReceivedFromProduct$);

export const preferredLocationDidUpdateGlobal$ = main$
  .filter(({ action }) => action.type === SELECT_GLOBAL_LOCATION);

export const preferredLocationDidUpdateGlobalOnSearch$ = preferredLocationDidUpdateGlobal$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === SEARCH_PATTERN);
  });

export const preferredLocationDidUpdateGlobalNotOnSearch$ = preferredLocationDidUpdateGlobal$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern !== SEARCH_PATTERN);
  });

export const preferredLocationDidUpdateGlobalOnCategory$ = preferredLocationDidUpdateGlobal$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern === CATEGORY_PATTERN);
  });

export const preferredLocationDidUpdateGlobalNotOnCategory$ = preferredLocationDidUpdateGlobal$
  .filter(({ getState }) => {
    const { pattern } = getCurrentRoute(getState());
    return (pattern !== CATEGORY_PATTERN);
  });

export const preferredLocationDidUpdate$ = main$
  .filter(({ action }) => action.type === SELECT_LOCATION);

export const storeFinderWillEnter$ = routeWillEnter$
  .filter(({ action }) => action.route.pattern === STORE_FINDER_PATTERN);

export const receiveLocations$ = main$
  .filter(({ action }) => action.type === RECEIVE_LOCATIONS);

export const preferredLocationDidUpdateOnPDP$ = preferredLocationDidUpdateGlobal$
  .filter(({ getState }) => {
    const getRoutePattern = makeGetRoutePattern();
    const routePattern = getRoutePattern(getState());
    return routePattern === ITEM_PATTERN;
  })
  .switchMap(({ dispatch, getState, action }) => {
    const state = getState();
    const { productId } = getCurrentState(state);
    const productData = getProductDataById(state, { productId });
    return Observable.of({
      action: {
        ...action,
        productData,
      },
      dispatch,
      getState,
    });
  });
