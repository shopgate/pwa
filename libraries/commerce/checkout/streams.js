import { historyDidUpdate$ } from '@shopgate/pwa-common/streams/router';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

/**
 * Gets triggered when the checkout link is opened.
 * @type {Observable}
 */
export const openedCheckoutLink$ = historyDidUpdate$
  .filter(({ action }) => (
    action.route &&
    action.route.pattern &&
    action.route.pattern === CHECKOUT_PATH
  ));
