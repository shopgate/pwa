import { openedLink$ } from '@shopgate/pwa-common/streams/history';
import { CHECKOUT_PATH } from '@shopgate/pwa-common/constants/RoutePaths';

/**
 * Gets triggered when the checkout link is opened.
 * @type {Observable}
 */
export const openedCheckoutLink$ = openedLink$
  .filter(({ action }) =>
    action.options &&
    action.options.url &&
    action.options.url === CHECKOUT_PATH);
