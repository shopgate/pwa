import {
  routeDidEnter,
  routeDidLeave,
} from '@shopgate/pwa-common/streams/history';
import { getRedirectLocation } from '@shopgate/pwa-common/selectors/history';
import { ITEM_PATH } from '../constants';
import setProductId from '../action-creators/setProductId';
import setProductVariantId from '../action-creators/setProductVariantId';
import { getCurrentProductVariantId } from '../selectors/variants';
import {
  getCurrentBaseProductId,
  getHistoryPathProductId,
} from '../selectors/product';
import { productRelationsReceived$ } from '../streams';
import getProductsById from '../actions/getProductsById';
import { getProductRelationsByHash } from '../selectors/relations';

/**
 * Product subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
function product(subscribe) {
  const itemRouteDidEnter$ = routeDidEnter(ITEM_PATH);
  const itemRouteDidLeave$ = routeDidLeave(ITEM_PATH).filter(({ pathname }) => (
    !pathname.startsWith(ITEM_PATH)
  ));

  subscribe(itemRouteDidEnter$, ({ dispatch, getState }) => {
    const state = getState();
    const historyProductId = getHistoryPathProductId(state);
    const currentBaseProductId = getCurrentBaseProductId(state);
    const selectedVariantId = getCurrentProductVariantId(state);

    // Only update when no child product is selected yet or when the history changed
    if (selectedVariantId || currentBaseProductId === historyProductId) {
      return;
    }

    dispatch(setProductId(historyProductId));
  });

  subscribe(itemRouteDidLeave$, ({ dispatch, getState }) => {
    /**
     * If there is a redirect to login, e.g. when a user wants to give a review on a product and
     * he is not logged in, we don't want the state to be mutated and to reset the current product.
     * We only reset the current product if the user leaves the product route by navigation.
     */
    if (!getRedirectLocation(getState())) {
      dispatch(setProductId(null));
      dispatch(setProductVariantId(null));
    }
  });

  subscribe(productRelationsReceived$, ({ dispatch, getState, action }) => {
    const { hash } = action;
    const productIds = getProductRelationsByHash(hash)(getState());

    dispatch(getProductsById(productIds));
  });
}

export default product;
