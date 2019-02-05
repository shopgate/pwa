import { main$ } from '@shopgate/pwa-common/streams/main';
import { historyDidUpdate$ } from '@shopgate/pwa-common/streams/history';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';
import { SUCCESS_CHECKOUT } from '../constants';

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

/**
 * Gets triggered when the checkout has been completed.
 * @type {Observable}
 */
export const checkoutSucceeded$ = main$.filter(({ action }) => (
  action.type === SUCCESS_CHECKOUT
));

