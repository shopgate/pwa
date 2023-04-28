import {
  getProductsResult,
  productIsReady$, productsReceived$, productsReceivedCached$,
  RECEIVE_PRODUCTS_CACHED,
  variantDidChange$,
} from '@shopgate/engage/product';
import {
  cartReceived$,
  fetchCart,
  cartDidEnter$,
  getCartItems,
} from '@shopgate/engage/cart';
import { userDidLogin$ } from '@shopgate/engage/user';
import {
  appDidStart$,
  routeWillEnter$,
  UIEvents,
  getCurrentRoute,
  hex2bin,
  getThemeSettings,
  getCurrentSearchQuery,
} from '@shopgate/engage/core';
import {
  receiveFavoritesWhileVisible$,
} from '@shopgate/pwa-common-commerce/favorites/streams';
import { getFavoritesItems } from '@shopgate/pwa-common-commerce/favorites/selectors';
import {
  categoryDidBackEnter$,
} from '@shopgate/pwa-common-commerce/category/streams';
import {
  searchDidBackEntered$,
} from '@shopgate/pwa-common-commerce/search/streams';
import {
  getUserSearch,
  getStoreFinderSearch,
  getPreferredLocation,
  getIsPending,
  getProductAlternativeLocationParams,
  getProductAlternativeLocations,
} from './selectors';
import {
  fetchLocations, fetchProductLocations, setPending, setUserGeolocation,
} from './actions';
import { setShowInventoryInLists, showInventoryInLists } from './helpers/showInventoryInLists';
import fetchInventories from './actions/fetchInventories';
import { EVENT_SET_OPEN } from './providers/FulfillmentProvider';
import fetchProductInventories from './actions/fetchProductInventories';
import {
  submitReservationSuccess$,
  userSearchChanged$,
  storeFinderWillEnter$,
  preferredLocationDidUpdateOnPDP$,
  provideAlternativeLocation$,
  preferredLocationDidUpdateGlobalOnWishlist$,
} from './locations.streams';
import selectLocation from './action-creators/selectLocation';
import { SET_STORE_FINDER_SEARCH_RADIUS } from './constants';
import selectGlobalLocation from './action-creators/selectGlobalLocation';

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
function locationsSubscriber(subscribe) {
  subscribe(appDidStart$, async ({ dispatch, getState }) => {
    // Fetch merchants locations.
    const userSearch = getUserSearch(getState());
    try {
      const { locations } = await dispatch(fetchLocations(userSearch));

      const preferredLocation = getPreferredLocation(getState());

      if (preferredLocation) {
        const { code } = preferredLocation;
        // Check if the preferred location is included within the fetched locations
        const hasLocation = !!locations.find(location => location.code === code);

        if (!hasLocation) {
          // Fetch the missing location data
          await dispatch(fetchLocations({
            codes: [code],
          }));
        }
      }

      // Preset preferredLocation if configured
      const { preferredLocationDefault } = getThemeSettings('@shopgate/engage/locations') || {};
      if (preferredLocationDefault) {
        // check if there is already a preferredLocation for the user, if not set one
        if (!preferredLocation) {
          const locationToPreselect = locations.find(l => l.code === preferredLocationDefault);
          if (locationToPreselect) {
            dispatch(selectLocation({ code: preferredLocationDefault }));
          }
        }
      }

      initialLocationsResolve(locations);
    } catch (error) {
      initialLocationsReject(error);
    }

    UIEvents.addListener(EVENT_SET_OPEN, () => {
      const route = getCurrentRoute(getState());

      if (!route.params.productId && !route.state.productId) {
        return;
      }

      const productId = route.state.productId || hex2bin(route.params.productId);

      if (productId) {
        dispatch(fetchProductLocations(productId, getUserSearch(getState())));
      }
    });
  });

  subscribe(userSearchChanged$, async ({ dispatch, getState, action }) => {
    const { productId, isStoreFinder, silent } = action;

    if (silent === true) {
      // Silent background propagation
      return;
    }

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

  const productInventoryNeedsUpdate$ = productIsReady$
    .merge(variantDidChange$)
    .merge(preferredLocationDidUpdateOnPDP$)
    .debounceTime(200);

  subscribe(productInventoryNeedsUpdate$, ({ action, dispatch, getState }) => {
    const { productData } = action;

    // Skip if no fulfillment methods are set.
    if (
      !productData
      || !productData.fulfillmentMethods
      || productData.fulfillmentMethods.length === 0
    ) {
      return;
    }

    const state = getState();
    const preferredLocation = getPreferredLocation(state);

    if (!preferredLocation) {
      return;
    }

    // Fetch inventories for this specific product.
    dispatch(fetchProductInventories(action.productData.id, {
      locationCodes: [preferredLocation.code],
    }));
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
    dispatch(selectGlobalLocation({ code: firstLocationCode }));
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

  const alternative$ = productInventoryNeedsUpdate$
    .switchMap(() => provideAlternativeLocation$.first());
  /**
   * Provide alternative location on PDP when preferred location is out of stock
   */
  subscribe(alternative$, async ({ action, dispatch, getState }) => {
    // Refresh geo location
    await dispatch(setUserGeolocation({ silent: true }));

    // Get new state with geolocation
    const state = getState();

    const alternativeLocations = getProductAlternativeLocations(state, action);
    if (alternativeLocations) {
      // Already fetched by default params
      return;
    }

    const { productId, params } = action;

    const alternativeParams = getProductAlternativeLocationParams(state);

    const fetchParams = {
      ...alternativeParams,
      ...params,
    };

    if (fetchParams.geolocation || fetchParams.postalCode) {
      dispatch(fetchProductLocations(productId, fetchParams));
    }
  });

  subscribe(
    categoryDidBackEnter$.merge(searchDidBackEntered$),
    ({ action, dispatch, getState }) => {
      const state = getState();

      if (!showInventoryInLists(state)) {
        return;
      }

      const { categoryId } = action.route.params;
      const query = getCurrentSearchQuery(state);

      const products = getProductsResult(
        state,
        {
          categoryId: hex2bin(categoryId),
          searchPhrase: query,
        }
      )?.products;

      if (!products || !products.length) {
        return;
      }

      const productCodes = products.map(({ id }) => id);

      dispatch(fetchInventories(productCodes));
    }
  );

  subscribe(productsReceived$.merge(productsReceivedCached$), ({ action, dispatch, getState }) => {
    if (!showInventoryInLists(getState())) {
      return;
    }

    if (!action.products || !action.products.length) {
      return;
    }

    const productCodes = action.type !== RECEIVE_PRODUCTS_CACHED ?
      action.products.map(({ id }) => id) : action.products;

    dispatch(fetchInventories(productCodes));
  });

  subscribe(
    receiveFavoritesWhileVisible$.merge(preferredLocationDidUpdateGlobalOnWishlist$),
    ({ dispatch, getState }) => {
      const state = getState();

      if (!showInventoryInLists(state)) {
        return;
      }
      const productIds = getFavoritesItems(state);

      if (!productIds || !productIds.length) {
        return;
      }

      dispatch(fetchInventories(productIds));
    }
  );

  subscribe(appDidStart$, ({ getState }) => {
    // enable inventory in product lists for some users
    setShowInventoryInLists(getState());
  });
}

export default locationsSubscriber;
