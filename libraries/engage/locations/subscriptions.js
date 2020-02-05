import { receivedVisibleProduct$ } from '@shopgate/engage/product';
import { fetchProductLocations } from './actions';

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
}

export default locations;
