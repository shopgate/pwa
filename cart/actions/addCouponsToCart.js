/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import addCoupons from '../action-creators/addCouponsToCart';
import errorAddCouponsToCart from '../action-creators/errorAddCouponsToCart';
import successAddCouponsToCart from '../action-creators/successAddCouponsToCart';

/**
 * Adds coupons to the cart.
 * @param {Array} couponIds The IDs of the coupons that shall be added to the cart.
 * @return {Function} A redux thunk.
 */
const addCouponsToCart = couponIds => dispatch => new Promise((resolve, reject) => {
  dispatch(addCoupons(couponIds));

  const request = new PipelineRequest('addCouponsToCart');
  request.setInput({ couponCodes: couponIds })
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();
      if (messages) {
        dispatch(errorAddCouponsToCart(couponIds, messages, requestsPending));
        reject();
      } else {
        dispatch(successAddCouponsToCart(couponIds, requestsPending));
        resolve();
      }
    })
    .catch((error) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(errorAddCouponsToCart(couponIds, undefined, requestsPending));
      logger.error('addCouponsToCart', error);
      reject();
    });
});

export default addCouponsToCart;
