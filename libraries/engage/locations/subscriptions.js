import { receivedVisibleProduct$ } from '@shopgate/engage/product';
import { cartWillEnter$, SHOPGATE_CART_GET_CART, getCartProducts } from '@shopgate/engage/cart';
import { receiveCoreConfig$, configuration, PIPELINES } from '@shopgate/engage/core';
import { FULFILLMENT_PATH_MULTI_LINE_RESERVE, SHOPGATE_STOREFRONT_GET_CART } from './constants';
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
      subscribe(cartWillEnter$, ({ dispatch, getState }) => {
        const cartItems = getCartProducts(getState());
        const locationIds = cartItems.map(item => (
          item.fulfillment && item.fulfillment.location && item.fulfillment.location.code
        )).filter(Boolean);
        if (locationIds) {
          dispatch(fetchLocationsById(locationIds));
        }
      });
    }
  });
}

export default locations;
