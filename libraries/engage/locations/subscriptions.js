import { receivedVisibleProduct$ } from '@shopgate/engage/product';
import {
  cartReceived$,
  cartWillEnter$,
  getCartProducts,
  fetchCart,
  cartDidEnter$,
} from '@shopgate/engage/cart';
import { receiveCoreConfig$ } from '@shopgate/engage/core';
import { MULTI_LINE_RESERVE } from './constants';
import { fetchLocationsById, fetchProductLocations } from './actions';
import { submitReservationSuccess$, receiveProductLocations$ } from './locations.streams';

/**
 * Locations subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function locations(subscribe) {
  subscribe(receivedVisibleProduct$, ({ action, dispatch }) => {
    const { productData } = action;

    if (
      !productData
      || !productData.fulfillmentMethods
      || productData.fulfillmentMethods.length === 0
    ) {
      return;
    }

    dispatch(fetchProductLocations(action.productData.id));
  });

  // Core config and cart subscriptions
  subscribe(receiveCoreConfig$, ({ action }) => {
    const {
      config: {
        merchantSettings: { enabledFulfillmentMethodSelectionForEngage = [] } = {},
      },
    } = action;

    if (enabledFulfillmentMethodSelectionForEngage.includes(MULTI_LINE_RESERVE)) {
      // Cart with ropis products
      const cartReceivedWithRopis$ = cartReceived$.filter(
        ({ action: { cart: { cartItems = [] } = {} } }) => (
          cartItems.some(item => (
            item.fulfillment && item.fulfillment.location && item.fulfillment.location.code
          ))
        )
      );

      // Fetch missing locations
      subscribe(cartReceivedWithRopis$, ({ dispatch, getState }) => {
        const cartItems = getCartProducts(getState());
        const locationIds = cartItems.map(item => (
          item.fulfillment && item.fulfillment.location && item.fulfillment.location.code
        )).filter(Boolean);
        if (locationIds) {
          dispatch(fetchLocationsById(locationIds));
        }
      });

      // Refresh ropis and mixed cart on every cart enter
      const cartRefresh$ = cartReceivedWithRopis$.switchMap(() => cartWillEnter$.first());
      subscribe(cartRefresh$, ({ dispatch }) => {
        dispatch(fetchCart());
      });
    }
  });

  subscribe(receiveProductLocations$, ({ dispatch, action }) => {
    const { locations: productLocations } = action;
    const locationIds = productLocations.map(({ code }) => code);

    if (locationIds.length) {
      dispatch(fetchLocationsById(locationIds));
    }
  });

  // Core config and cart subscriptions
  const fetchCart$ = cartDidEnter$.switchMap(() => submitReservationSuccess$.first()).delay(500);
  subscribe(fetchCart$, ({ dispatch }) => {
    dispatch(fetchCart());
  });
}

export default locations;
