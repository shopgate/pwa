/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { main$ } from '@shopgate/pwa-common/streams/main';
import { openedLink$ } from '@shopgate/pwa-common/streams/history';
import { OPEN_LINK } from '@shopgate/pwa-common/constants/ActionTypes';
import {
  REQUEST_CART,
  RECEIVE_CART,
  ERROR_CART,

  ADD_PRODUCTS_TO_CART,
  SUCCESS_ADD_PRODUCTS_TO_CART,
  ERROR_ADD_PRODUCTS_TO_CART,

  UPDATE_PRODUCTS_IN_CART,
  SUCCESS_UPDATE_PRODUCTS_IN_CART,
  ERROR_UPDATE_PRODUCTS_IN_CART,

  DELETE_PRODUCTS_FROM_CART,
  SUCCESS_DELETE_PRODUCTS_FROM_CART,
  ERROR_DELETE_PRODUCTS_FROM_CART,

  ADD_COUPONS_TO_CART,
  SUCCESS_ADD_COUPONS_TO_CART,
  ERROR_ADD_COUPONS_TO_CART,

  COUPON_PUSH_NOTIFICATION,

  DELETE_COUPONS_FROM_CART,
  ERROR_DELETE_COUPONS_FROM_CART,
  SUCCESS_DELETE_COUPONS_FROM_CART,
} from '../constants';

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const cartRequesting$ = main$.filter(
  ({ action }) => action.type === REQUEST_CART
);

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const cartReceived$ = main$.filter(
  ({ action }) =>
    action.type === RECEIVE_CART ||
    action.type === ERROR_CART
);

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const couponsAdded$ = main$.filter(
  ({ action }) => action.type === ADD_COUPONS_TO_CART
);

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const couponsDeleted$ = main$.filter(
  ({ action }) => action.type === DELETE_COUPONS_FROM_CART
);

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const couponsUpdated$ = main$.filter(
  ({ action }) =>
    action.type === SUCCESS_ADD_COUPONS_TO_CART ||
    action.type === ERROR_ADD_COUPONS_TO_CART ||
    action.type === SUCCESS_DELETE_COUPONS_FROM_CART ||
    action.type === ERROR_DELETE_COUPONS_FROM_CART
);

/**
 * Gets triggered when a link containing a coupon parameter is opened.
 * @type {Observable}
 */
export const couponLinkOpened$ = main$.filter(
  ({ action }) => (
    action.type === OPEN_LINK &&
    action.options &&
    action.options.queryParams &&
    action.options.queryParams.coupon
  ));

/**
 * Gets triggered when a push notification containing a coupon code is opened.
 * @type {Observable}
 */
export const couponPushNotification$ = openedLink$
  .filter(
    ({ action }) => {
      // Stop here if we didn't receive a url.
      if (!action.options || !action.options.url) {
        return false;
      }

      // Split the URL string and remove any empty strings.
      const paths = action.options.url.split('/').filter(Boolean);

      /**
       * Check that this is the correct push action for coupons and
       * that we have a code to use (second path).
       */
      return (paths[0] === COUPON_PUSH_NOTIFICATION && paths.length === 2);
    })
  .map(input => ({
    ...input,
    code: input.action.options.url.split('/').filter(Boolean)[1],
  }));

/**
 * Gets triggered when the user tried to add a product to the cart.
 * @type {Observable}
 */
export const productsAdded$ = main$.filter(
  ({ action }) => action.type === ADD_PRODUCTS_TO_CART
);

/**
 * Gets triggered when the user tried to add a product to the cart.
 * @type {Observable}
 */
export const productsModified$ = main$.filter(
  ({ action }) => action.type === UPDATE_PRODUCTS_IN_CART
);

/**
 * Gets triggered when the user tried to add a product to the cart.
 * @type {Observable}
 */
export const productsDeleted$ = main$.filter(
  ({ action }) => action.type === DELETE_PRODUCTS_FROM_CART
);

/**
 * Gets triggered when the user tried to add a coupon to the cart.
 * @type {Observable}
 */
export const productsUpdated$ = main$.filter(
  ({ action }) =>
    action.type === SUCCESS_ADD_PRODUCTS_TO_CART ||
    action.type === ERROR_ADD_PRODUCTS_TO_CART ||
    action.type === SUCCESS_UPDATE_PRODUCTS_IN_CART ||
    action.type === ERROR_UPDATE_PRODUCTS_IN_CART ||
    action.type === SUCCESS_DELETE_PRODUCTS_FROM_CART ||
    action.type === ERROR_DELETE_PRODUCTS_FROM_CART
);

/**
 * Gets triggered when the remote cart was updated.
 * @type {Observable}
 */
export const remoteCartDidUpdate$ = main$.filter(
  ({ action }) =>
    action.type === SUCCESS_ADD_PRODUCTS_TO_CART ||
    action.type === ERROR_ADD_PRODUCTS_TO_CART ||
    action.type === SUCCESS_UPDATE_PRODUCTS_IN_CART ||
    action.type === ERROR_UPDATE_PRODUCTS_IN_CART ||
    action.type === SUCCESS_DELETE_PRODUCTS_FROM_CART ||
    action.type === ERROR_DELETE_PRODUCTS_FROM_CART ||
    action.type === SUCCESS_ADD_COUPONS_TO_CART ||
    action.type === ERROR_ADD_COUPONS_TO_CART ||
    action.type === SUCCESS_DELETE_COUPONS_FROM_CART ||
    action.type === ERROR_DELETE_COUPONS_FROM_CART
  );
