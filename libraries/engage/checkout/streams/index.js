import { main$ } from '@shopgate/pwa-common/streams';
import { routeDidLeave$ } from '@shopgate/engage/core';
import { CHECKOUT_CONFIRMATION_PATTERN } from '../constants';
import {
  SUBMIT_CHECKOUT_ORDER_SUCCESS,
  FETCH_CHECKOUT_ORDER_SUCCESS,
} from '../constants/actionTypes';

export const checkoutConfirmationDidLeave$ = routeDidLeave$
  .filter(({ action }) => action.route.pattern === CHECKOUT_CONFIRMATION_PATTERN);

export const checkoutOrderFetched$ = main$
  .filter(({ action }) => action.type === FETCH_CHECKOUT_ORDER_SUCCESS);

export const checkoutSuccess$ = main$
  .filter(({ action }) => action.type === SUBMIT_CHECKOUT_ORDER_SUCCESS)
  .switchMap(() => checkoutOrderFetched$.first());
