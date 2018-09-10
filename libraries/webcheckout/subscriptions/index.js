import {
  userWillLogin$,
  userDidLogin$,
  userWillLogout$,
} from '@shopgate/pwa-common/streams/user';
import { historyRedirect } from '@shopgate/pwa-common/actions/router';
import { hasShopifyCheckout } from '../selectors';
import login from '../actions/login';
import logout from '../actions/logout';
import { shopifyDidRespond$ } from '../streams';

/**
 * Shopify subscriptions.
 * @param {Function} subscribe The subscribe function.
 */
export default function shopify(subscribe) {
  /**
   * Don't create any subscriptions if there is no Shopify checkout available.
   */
  if (!hasShopifyCheckout()) {
    return;
  }

  /**
   * Gets triggered when the user did log in and a Shopify response was received.
   */
  const shouldRedirect$ = userDidLogin$.zip(shopifyDidRespond$).map(([first]) => first);

  subscribe(shouldRedirect$, ({ dispatch, action }) => {
    dispatch(historyRedirect(action.redirect));
  });

  /**
   * Gets triggered when the user wants to login.
   */
  subscribe(userWillLogin$, ({ dispatch, action }) => {
    dispatch(login(action.user, action.password));
  });

  /**
   * Gets triggered when the user wants to logout.
   */
  subscribe(userWillLogout$, ({ dispatch }) => {
    dispatch(logout());
  });
}
