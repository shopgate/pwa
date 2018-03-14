import { historyDidUpdate$ } from '@shopgate/pwa-common/streams/history';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

/**
 * Gets triggered when the checkout link is opened.
 * @type {Observable}
 */
export const openedCheckoutLink$ = historyDidUpdate$
  .filter(({ action }) => (
    action.historyProps &&
    action.historyProps.pathname &&
    action.historyProps.pathname === CHECKOUT_PATH
  ));

