import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { ERROR_ADD_PRODUCTS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import { productsUpdated$, productsAdded$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { variantDidChange$ } from '@shopgate/pwa-common-commerce/product/streams';
import { routeDidEnter, routeDidLeave } from '@shopgate/pwa-common/streams/history';
import {
  resetActionCount,
  decrementActionCount,
  incrementActionCount,
} from './actions';

/**
 * AddToCartBar subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function addToCartBar(subscribe) {
  const itemRouteDidEnter$ = routeDidEnter(ITEM_PATH);
  const itemRouteDidLeave$ = routeDidLeave(ITEM_PATH);

  const productNotAdded = productsUpdated$.filter(({ action }) => (
    action.type === ERROR_ADD_PRODUCTS_TO_CART
  ));

  /**
   * Gets triggered when the item route was entered.
   */
  subscribe(itemRouteDidEnter$, ({ dispatch }) => {
    dispatch(resetActionCount());
  });

  /**
   * Gets triggered when the item route was left.
   */
  subscribe(itemRouteDidLeave$, ({ dispatch }) => {
    dispatch(resetActionCount());
  });

  /**
   * Gets triggered when a variant selection is made.
   * Resets the add to cart bar.
   */
  subscribe(variantDidChange$, ({ dispatch }) => {
    dispatch(resetActionCount());
  });

  /**
   * Gets triggered when an add to cart is requested.
   * Increases the quantity of added items that will be added to cart.
   */
  subscribe(productsAdded$, ({ dispatch }) => {
    dispatch(incrementActionCount());
  });

  /**
   * Gets triggered when a product couldn't be added to cart.
   * Decreases the quantity of added items.
   */
  subscribe(productNotAdded, ({ dispatch }) => {
    dispatch(decrementActionCount());
  });
}
