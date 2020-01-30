import { hex2bin } from '@shopgate/engage/core';
import { productWillEnter$ } from '@shopgate/engage/product';
import { fetchProductLocations } from './actions';

/**
 * Locations subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function locations(subscribe) {
  subscribe(productWillEnter$, ({ action, dispatch }) => {
    const { productId } = action.route.params;
    const { productId: variantId } = action.route.state;
    const id = variantId || hex2bin(productId);

    dispatch(fetchProductLocations(id));
  });
}

export default locations;
