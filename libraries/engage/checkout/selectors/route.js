import { createSelector } from 'reselect';
import pathMatch from 'path-match';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
import { checkoutRoutes } from '@shopgate/engage/checkout/constants';

const matcher = pathMatch({
  sensitive: false,
  strict: false,
  end: true,
});

/**
 * Creates a selector that determines if a route belongs to the checkout process
 * @returns {Function}
 */
export const makeIsCheckoutRoute = () => createSelector(
  getCurrentPathname,
  pathname => checkoutRoutes.some(route => matcher(route)(pathname))
);
