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
  userSearchChanged$,
} from './locations.streams';

/**
 * Locations subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function locations(subscribe) {
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    // Fetch merchants locations.
    const userSearch = getUserSearch(getState());
    await dispatch(fetchLocations(userSearch));
  });

  subscribe(userSearchChanged$, async ({ dispatch, getState, action }) => {
    const { productId } = action;
    const userSearch = getUserSearch(getState());

    if (!productId) {
      await dispatch(fetchLocations(userSearch));
    } else {
      await dispatch(fetchProductLocations(productId, userSearch));
    }
  });

  subscribe(receivedVisibleProduct$.debounceTime(100), ({ action, dispatch, getState }) => {
    const { productData } = action;

    // Skip if no fulfillment methods are set.
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

    // Fetch all locations for product without filters.
    dispatch(fetchProductLocations(action.productData.id, {}));
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
