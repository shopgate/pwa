import { createSelector } from 'reselect';
import { isUserLoggedIn } from '@shopgate/engage/user';
import { getCheckoutOrder } from './order';

export const isGuestCheckoutActive = createSelector(
  isUserLoggedIn,
  getCheckoutOrder,
  // eslint-disable-next-line no-unused-vars
  (userLoggedIn, checkoutOrder) => false
);
