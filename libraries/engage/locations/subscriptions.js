import { receivedVisibleProduct$ } from '@shopgate/engage/product';
import { SHOPGATE_CART_GET_CART, getCartProducts, cartReceived$ } from '@shopgate/engage/cart';
import { receiveCoreConfig$, configuration, PIPELINES } from '@shopgate/engage/core';
import { fetchCart } from '../cart';
import {
  FULFILLMENT_PATH_MULTI_LINE_RESERVE,
  PRODUCT_FULFILLMENT_METHOD_ROPIS,
  SHOPGATE_STOREFRONT_GET_CART,
} from './constants';
import { fetchLocationsById, fetchProductLocations } from './actions';

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

    if (enabledFulfillmentMethodSelectionForEngage.includes(FULFILLMENT_PATH_MULTI_LINE_RESERVE)) {
      // 1. Exchange pipeline for get cart
      configuration.update(PIPELINES, pipelines => ({
        ...pipelines,
        [SHOPGATE_CART_GET_CART]: SHOPGATE_STOREFRONT_GET_CART,
      }));

      // 2. Subscribe to cart updates
      subscribe(cartReceived$, ({ dispatch, getState }) => {
        const cartItems = getCartProducts(getState());
        const locationIds = cartItems.map(item => (
          item.fulfillment && item.fulfillment.location && item.fulfillment.location.code
        )).filter(Boolean);
        if (locationIds) {
          dispatch(fetchLocationsById(locationIds));
        }

        // 2. Load cart information every cart page view with ropis items (inventory updates)
        const hasRopis = cartItems.some(cartItem => (
          cartItem.fulfillment && cartItem.fulfillment.method === PRODUCT_FULFILLMENT_METHOD_ROPIS
        ));
        if (hasRopis) {
          dispatch(fetchCart());
        }
      });
    }
  });
}

export default locations;
