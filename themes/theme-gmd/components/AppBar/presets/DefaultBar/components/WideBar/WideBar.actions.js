import { historyPush, historyPop, historyResetTo } from '@shopgate/pwa-common/actions/router';
import { INDEX_PATH } from '@shopgate/engage/core';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import { makeIsCheckoutRoute } from '@shopgate/engage/checkout';
import {
  getRouterStackIndex,
  makeGetPrevRouteIndexByPattern,
} from '@shopgate/pwa-common/selectors/router';

const isCheckoutRoute = makeIsCheckoutRoute();
const getPrevRouteIndexByPatternCart = makeGetPrevRouteIndexByPattern(CART_PATH);
const getPrevRouteIndexByPatternIndex = makeGetPrevRouteIndexByPattern(INDEX_PATH);

/**
 * Performs page navigation for the wide bar
 * @param {string} pathname The path to navigate to.
 * @returns {Function}
 */
export const navigate = pathname => async (dispatch, getState) => {
  const state = getState();

  // When called within the checkout context we navigate back within the history instead of forward
  if (isCheckoutRoute(state)) {
    const currentRouteIndex = getRouterStackIndex(state);
    let nextRouteIndex;

    if (pathname === CART_PATH) {
      nextRouteIndex = getPrevRouteIndexByPatternCart(state);
    } else if (pathname === INDEX_PATH) {
      nextRouteIndex = getPrevRouteIndexByPatternIndex(state);
    }

    if (nextRouteIndex !== -1) {
      const steps = currentRouteIndex - nextRouteIndex;
      // Navigate back to a previous history entry if possible
      dispatch(historyPop({ steps }));
    } else {
      // Reset the history stack to the desired page when there is no old page within the stack
      dispatch(historyResetTo(pathname));
    }
  } else {
    // Perform the regular forward navigation
    dispatch(historyPush({ pathname }));
  }
};
