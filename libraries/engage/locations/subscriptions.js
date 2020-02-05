import { productReceived$ } from '@shopgate/engage/product';
import { fetchProductLocations } from './actions';

/**
 * Locations subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function locations(subscribe) {
  subscribe(productReceived$, ({ action, dispatch }) => {
    const { productData } = action;

    if (
      !productData
      || !productData.fulfillmentMethods
      || productData.fulfillmentMethods.lengt === 0
    ) {
      return;
    }

    dispatch(fetchProductLocations(action.productData.id));
  });
}

export default locations;
