import { main$ } from '@shopgate/pwa-common/streams';
import { Observable } from 'rxjs/Observable';
import { cartReceived$ } from '@shopgate/pwa-common-commerce/cart/streams';
import {
  SUBMIT_RESERVATION_SUCCESS,
  RECEIVE_PRODUCT_LOCATIONS,
  SET_USER_SEARCH_COUNTRY_CODE,
  SET_USER_SEARCH_POSTAL_CODE,
  SET_USER_SEARCH_GEOLOCATION,
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
    action.type === SET_USER_SEARCH_GEOLOCATION);

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
