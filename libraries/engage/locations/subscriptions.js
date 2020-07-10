import { receivedVisibleProduct$ } from '@shopgate/engage/product';
import {
  cartWillEnter$,
  fetchCart,
  cartDidEnter$,
} from '@shopgate/engage/cart';
import { receiveCoreConfig$, appDidStart$ } from '@shopgate/engage/core';
import { MULTI_LINE_RESERVE } from './constants';
import { getUserSearch } from './selectors';
import { fetchLocations, fetchProductLocations } from './actions';
import {
  submitReservationSuccess$,
  cartReceivedWithROPE$,
} from './locations.streams';

/**
 * Locations subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function locations(subscribe) {
  subscribe(appDidStart$, async ({ dispatch }) => {
    // Fetch merchants locations.
    await dispatch(fetchLocations({}));
  });

  subscribe(receivedVisibleProduct$, ({ action, dispatch, getState }) => {
    const { productData } = action;

    // Skip if no fulfullment methoods are set.
    if (
      !productData
      || !productData.fulfillmentMethods
      || productData.fulfillmentMethods.length === 0
    ) {
      return;
    }

    // Fetch locations for this specific product.
    const userSearch = getUserSearch(getState());
    dispatch(fetchProductLocations(action.productData.id, userSearch));
  });

  // Core config and cart subscriptions
  subscribe(receiveCoreConfig$, ({ action }) => {
    const {
      config: {
        merchantSettings: { enabledFulfillmentMethodSelectionForEngage = [] } = {},
      },
    } = action;
    if (enabledFulfillmentMethodSelectionForEngage.includes(MULTI_LINE_RESERVE)) {
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
