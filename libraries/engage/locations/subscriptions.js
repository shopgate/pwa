import { receivedVisibleProduct$ } from '@shopgate/engage/product';
import {
  cartReceived$,
  cartWillEnter$,
  fetchCart,
  cartDidEnter$,
  getCartItems,
} from '@shopgate/engage/cart';
import { userDidLogin$ } from '@shopgate/engage/user';
import { receiveCoreConfig$, appDidStart$, routeWillEnter$ } from '@shopgate/engage/core';
import { MULTI_LINE_RESERVE, SET_STORE_FINDER_SEARCH_RADIUS } from './constants';
import {
  getUserSearch, getStoreFinderSearch, getPreferredLocation, getIsPending,
} from './selectors';
import { fetchLocations, fetchProductLocations, setPending } from './actions';
import selectLocation from './action-creators/selectLocation';
import {
  submitReservationSuccess$,
  cartReceivedWithROPE$,
  userSearchChanged$,
  storeFinderWillEnter$,
} from './locations.streams';

let initialLocationsResolve;
let initialLocationsReject;
const initialLocationsPromise = new Promise((resolve, reject) => {
  initialLocationsResolve = resolve;
  initialLocationsReject = reject;
});

/**
 * Sets a location once the location has been validated.
 * @param {string} locationCode Location code
 * @param {Function} dispatch Redux dispatch function
 * @returns {Promise}
 */
const setLocationOnceAvailable = async (locationCode, dispatch) => {
  try {
    const { locations: initialLocations } = await initialLocationsPromise;
    if (!initialLocations.some(l => l.code === locationCode)) {
      return;
    }
    dispatch(selectLocation({ code: locationCode }));
    requestAnimationFrame(() => {
      dispatch(setPending(false));
    });
  } catch (error) {
    // Location won't be set.
  }
};

/**
 * Locations subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function locations(subscribe) {
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    // Fetch merchants locations.
    const userSearch = getUserSearch(getState());
    try {
      const result = await dispatch(fetchLocations(userSearch));
      initialLocationsResolve(result);
    } catch (error) {
      initialLocationsReject(error);
    }
  });

  subscribe(userSearchChanged$, async ({ dispatch, getState, action }) => {
    const { productId, isStoreFinder } = action;
    const state = getState();
    const userSearch = getUserSearch(state);

    if (isStoreFinder || action.type === SET_STORE_FINDER_SEARCH_RADIUS) {
      const storeFinderSearch = getStoreFinderSearch(state);
      await dispatch(fetchLocations({
        ...userSearch,
        ...storeFinderSearch,
        enableInLocationFinder: true,
      }));
    } else if (!productId) {
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

  subscribe(storeFinderWillEnter$, async ({ dispatch, getState }) => {
    const state = getState();
    // Fetch merchants locations.
    const userSearch = getUserSearch(state);
    const storeFinderSearch = getStoreFinderSearch(state);
    await dispatch(fetchLocations({
      ...userSearch,
      ...storeFinderSearch,
      enableInLocationFinder: true,
    }));
  });

  /**
   * Makes sure that the active location is switched after logging in
   * to a location that is also available in the cart.
   * Avoids having a selected location that differs from the cart
   */
  const afterCartMerge$ = userDidLogin$.mergeMap(() => cartReceived$.first());
  subscribe(afterCartMerge$, async ({ dispatch, getState }) => {
    const state = getState();
    const cartItems = getCartItems(state);
    const preferredLocation = getPreferredLocation(state, {});
    if (!cartItems?.length) {
      return;
    }

    const activeCartLocation = cartItems.find(item =>
      item.fulfillment?.location?.code === preferredLocation?.code);

    if (activeCartLocation) {
      return;
    }

    const firstLocationCode = cartItems[0]?.fulfillment?.location?.code;
    if (!firstLocationCode) {
      return;
    }

    dispatch(selectLocation({ code: firstLocationCode }));
  });

  /**
   * Handles an added store url parameter that will set the default store location
   */
  subscribe(routeWillEnter$, ({ action, dispatch, getState }) => {
    const locationCode = action.route.query.store;
    if (!locationCode) {
      if (!getIsPending(getState())) {
        dispatch(setPending(false));
      }
      return;
    }
    setLocationOnceAvailable(locationCode, dispatch);
  });
}

export default locations;
