import { createSelector } from 'reselect';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import { checkoutRoutes } from '@shopgate/engage/checkout/constants';

/**
 * Creates a selector that determines if a route belongs to the checkout process
 * @returns {Function}
 */
export const makeIsCheckoutRoute = () => createSelector(
  getCurrentPathname,
  pathname => checkoutRoutes.includes(pathname)
);
