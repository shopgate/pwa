import { productsAdded$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { getAddToCartProducts } from '../selectors/cart';
import getPage from '../selectors/page';
import { track } from '../helpers/index';

/**
 * Pages tracking subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function cart(subscribe) {
  /**
   * Gets triggered on product variant change/selection
   */
  subscribe(productsAdded$, ({ getState, action }) => {
    const state = getState();
    const products = getAddToCartProducts(state, action.products);
    const page = getPage(state);

    track('addToCart', {
      products,
      page,
    }, state);
  });
}
