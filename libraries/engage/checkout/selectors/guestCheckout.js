import { createSelector } from 'reselect';
import { isUserLoggedIn } from '@shopgate/engage/user';
import { getCheckoutOrder, getIsReserveOnly } from './order';

/**
 * Returns whether a guest checkout session is currently active.
 */
export const isGuestCheckoutActive = createSelector(
  isUserLoggedIn,
  getCheckoutOrder,
  (userLoggedIn, checkoutOrder) => !userLoggedIn && !!checkoutOrder
);

/**
 * Returns all required fields for current guest checkout session.
 */
export const getRequiredGuestCheckoutFields = createSelector(
  getIsReserveOnly,
  isReserveOnly => [
    'firstName',
    'lastName',
    'emailAddress',
    'mobile',
    ...(!isReserveOnly ? [
      'address1',
      'postalCode',
      'city',
      'country',
    ] : []),
  ]
);
