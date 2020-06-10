import { receivedVisibleProduct$ } from '@shopgate/engage/product';
import {
  cartWillEnter$,
  fetchCart,
  cartDidEnter$,
} from '@shopgate/engage/cart';
import { receiveCoreConfig$ } from '@shopgate/engage/core';
import { MULTI_LINE_RESERVE } from './constants';
import { fetchLocationsById, fetchProductLocations } from './actions';
import {
  submitReservationSuccess$,
  cartReceivedWithROPE$,
  fulfillmentLocationsReceived$,
} from './locations.streams';

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
      // Fetch missing locations
      subscribe(fulfillmentLocationsReceived$, ({ dispatch, locationCodes }) => {
        dispatch(fetchLocationsById(locationCodes));
      });

      // Refresh ropis and mixed cart on every cart enter
      const cartRefresh$ = cartReceivedWithROPE$.switchMap(() => cartWillEnter$.first());
      subscribe(cartRefresh$, ({ dispatch }) => {
        dispatch(fetchCart());
      });
    }
  });

  // Core config and cart subscriptions
  const fetchCart$ = cartDidEnter$.switchMap(() => submitReservationSuccess$.first()).delay(500);
  subscribe(fetchCart$, ({ dispatch }) => {
    dispatch(fetchCart());
  });
}

export default locations;
