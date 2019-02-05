import { main$ } from '@shopgate/pwa-common/streams/main';
import { SUCCESS_CHECKOUT } from '../constants';

/**
 * Gets triggered when the checkout has been completed.
 * @type {Observable}
 */
export const checkoutSucceeded$ = main$.filter(({ action }) => (
  action.type === SUCCESS_CHECKOUT
));
