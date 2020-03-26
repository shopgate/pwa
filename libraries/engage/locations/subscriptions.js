import { receivedVisibleProduct$ } from '@shopgate/engage/product';
import {
  cartReceived$,
  cartWillEnter$,
  getCartProducts,
  SHOPGATE_CART_GET_CART,
  SHOPGATE_CART_UPDATE_PRODUCTS,
  fetchCart,
  cartDidEnter$,
} from '@shopgate/engage/cart';
import { configuration, PIPELINES, receiveCoreConfig$ } from '@shopgate/engage/core';
import {
  MULTI_LINE_RESERVE,
  SHOPGATE_STOREFRONT_GET_CART,
  SHOPGATE_STOREFRONT_UPDATE_CART,
} from './constants';
import { fetchLocationsById, fetchProductLocations } from './actions';
import { submitReservationSuccess$ } from './locations.streams';

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
      // 1. Exchange pipeline for get/update cart
      configuration.update(PIPELINES, pipelines => ({
        ...pipelines,
        [SHOPGATE_CART_GET_CART]: SHOPGATE_STOREFRONT_GET_CART,
        [SHOPGATE_CART_UPDATE_PRODUCTS]: SHOPGATE_STOREFRONT_UPDATE_CART,
      }));

      // Cart with ropis products
      const cartReceivedWithRopis$ = cartReceived$.filter(
        ({ action: { cart: { cartItems = [] } = {} } }) => (
          cartItems.some(item => (
            item.fulfillment && item.fulfillment.location && item.fulfillment.location.code
          ))
        )
      );

      // 2. Fetch missing locations
      subscribe(cartReceivedWithRopis$, ({ dispatch, getState }) => {
        const cartItems = getCartProducts(getState());
        const locationIds = cartItems.map(item => (
          item.fulfillment && item.fulfillment.location && item.fulfillment.location.code
        )).filter(Boolean);
        if (locationIds) {
          dispatch(fetchLocationsById(locationIds));
        }
      });

      // 3. Refresh ropis and mixed cart on every cart enter
      const cartRefresh$ = cartReceivedWithRopis$.switchMap(() => cartWillEnter$.first());
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
