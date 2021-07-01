import { main$ } from '@shopgate/pwa-common/streams/main';
import { ITEM_PATTERN } from '@shopgate/pwa-common-commerce/product/constants';
import { ERROR_ADD_PRODUCTS_TO_CART } from '@shopgate/pwa-common-commerce/cart/constants';
import { productsUpdated$, productsAdded$ } from '@shopgate/pwa-common-commerce/cart/streams';
import { variantDidChange$ } from '@shopgate/pwa-common-commerce/product/streams';
import { routeDidEnter$, routeDidLeave$ } from '@shopgate/pwa-common/streams/router';
import * as constants from './constants';
import * as actions from './action-creators';

const itemRouteDidEnter$ = routeDidEnter$
  .filter(({ action }) => action.route.pattern === ITEM_PATTERN);
const itemRouteDidLeave$ = routeDidLeave$
  .filter(({ action }) => action.route.pattern === ITEM_PATTERN);
const productNotAdded$ = productsUpdated$
  .filter(({ action }) => action.type === ERROR_ADD_PRODUCTS_TO_CART);
const incrementActionCount$ = main$
  .filter(({ action }) => action.type === constants.INCREMENT_ACTION_COUNT);
const decrementActionCount$ = main$
  .filter(({ action }) => action.type === constants.DECREMENT_ACTION_COUNT);
const resetActionCount$ = main$
  .filter(({ action }) => action.type === constants.RESET_ACTION_COUNT);
const showAddToCartBar$ = main$
  .filter(({ action }) => action.type === constants.SHOW_ADD_TO_CART_BAR);
const hideAddToCartBar$ = main$
  .filter(({ action }) => action.type === constants.HIDE_ADD_TO_CART_BAR);

/**
 * AddToCartBar subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function addToCartBar(subscribe) {
  subscribe(incrementActionCount$, ({ events, action }) => {
    events.emit(constants.INCREMENT_ACTION_COUNT, action.count);
  });
  subscribe(decrementActionCount$, ({ events, action }) => {
    events.emit(constants.DECREMENT_ACTION_COUNT, action.count);
  });
  subscribe(resetActionCount$, ({ events }) => {
    events.emit(constants.RESET_ACTION_COUNT);
  });
  subscribe(showAddToCartBar$, ({ events }) => {
    events.emit(constants.SHOW_ADD_TO_CART_BAR);
  });
  subscribe(hideAddToCartBar$, ({ events }) => {
    events.emit(constants.HIDE_ADD_TO_CART_BAR);
  });

  subscribe(itemRouteDidEnter$, ({ dispatch }) => {
    dispatch(actions.resetActionCount());
  });

  subscribe(itemRouteDidLeave$, ({ dispatch }) => {
    dispatch(actions.resetActionCount());
  });

  subscribe(variantDidChange$, ({ dispatch }) => {
    dispatch(actions.resetActionCount());
  });

  subscribe(productsAdded$, ({ dispatch, action }) => {
    const { products = [] } = action;
    const count = products.reduce((quantity, product) => {
      // eslint-disable-next-line no-param-reassign
      quantity += Number(product.quantity);
      return quantity;
    }, 0);
    dispatch(actions.incrementActionCount(count));
  });

  subscribe(productNotAdded$, ({ dispatch, action }) => {
    const { products = [] } = action;
    const count = products.reduce((quantity, product) => {
      // eslint-disable-next-line no-param-reassign
      quantity += Number(product.quantity);
      return quantity;
    }, 0);
    dispatch(actions.decrementActionCount(count));
  });
}
