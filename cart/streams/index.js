import { main$ } from '@shopgate/pwa-common/streams/main';
import {
  SUCCESS_ADD_PRODUCTS_TO_CART,
  SUCCESS_DELETE_PRODUCTS_FROM_CART,
  SUCCESS_UPDATE_PRODUCTS_IN_CART,
  ERROR_UPDATE_PRODUCTS_IN_CART,
  SUCCESS_ADD_COUPONS_TO_CART,
  ERROR_ADD_COUPONS_TO_CART,
  SUCCESS_DELETE_COUPONS_FROM_CART,
} from '../constants';

/**
 * Gets triggered when the remote cart was updated.
 * @type {Observable}
 */
export const remoteCartDidUpdate$ = main$.filter(
  ({ action }) =>
    action.type === SUCCESS_ADD_PRODUCTS_TO_CART ||
    action.type === SUCCESS_DELETE_PRODUCTS_FROM_CART ||
    action.type === SUCCESS_UPDATE_PRODUCTS_IN_CART ||
    action.type === ERROR_UPDATE_PRODUCTS_IN_CART ||
    action.type === SUCCESS_ADD_COUPONS_TO_CART ||
    action.type === SUCCESS_DELETE_COUPONS_FROM_CART
  );

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const couponsDidUpdate$ = main$.filter(
  ({ action }) =>
    action.type === SUCCESS_ADD_COUPONS_TO_CART ||
    action.type === ERROR_ADD_COUPONS_TO_CART
);
