import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/defer';
import { Observable } from 'rxjs/Observable';

import { productsAdded$ as originalProductsAdded$ } from '@shopgate/engage/cart';
import { getProductById, fetchProductsById } from '@shopgate/engage/product';

/**
 * Emits when a product was added to the cart and product data is available
 */
export const productsAdded$ = originalProductsAdded$
  .switchMap((input) => {
    const { getState, action, dispatch } = input;
    const { products = [] } = action;

    // Collect product ids from the add-to-cart action
    const productIds = products.map(({ productId }) => productId).filter(Boolean);

    // Check if we have product data for all productIds
    const productDataAvailable = productIds
      .every(productId => getProductById(getState(), { productId }));

    if (productDataAvailable) {
      // All product data for the tracking even is available - handover action data to subscribers
      return Observable.of(input);
    }

    /**
     * Incomplete product data can be caused by an add-to-cart push message. In that case the
     * product was never fetched before due to visiting PDP. So we need to fetch missing product
     * data first.
     * Subscribers will receive the original action when product data comes available.
     */
    return Observable
      .defer(async () => {
        let result = { products: [] };

        try {
          result = await dispatch(fetchProductsById(productIds));
        } catch (e) {
        // nothing to do here - default result will be returned
        }

        return result;
      })
      .first()
      // do not proceed when request didn't return any products (no suitable tracking data)
      .filter(data => Array.isArray(data.products) && data.products.length > 0)
      // handover original action to subscribers
      .switchMap(() => Observable.of(input));
  });
