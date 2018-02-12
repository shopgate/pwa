/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import deleteCoupons from '../action-creators/deleteCouponsFromCart';
import errorDeleteCouponsFromCart from '../action-creators/errorDeleteCouponsFromCart';
import successDeleteCouponsFromCart from '../action-creators/successDeleteCouponsFromCart';

/**
 * Deletes coupons from the cart.
 * @param {Array} couponIds The IDs of the coupons that shall be deleted from the cart.
 * @return {Function} A redux thunk.
 */
const deleteCouponsFromCart = couponIds => (dispatch) => {
  dispatch(deleteCoupons(couponIds));

  const request = new PipelineRequest('deleteCouponsFromCart');
  request.setInput({ couponCodes: couponIds })
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(successDeleteCouponsFromCart(requestsPending));

      if (messages) {
        dispatch(errorDeleteCouponsFromCart(couponIds, messages, requestsPending));
      }
    })
    .catch((error) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(errorDeleteCouponsFromCart(couponIds, undefined, requestsPending));
      logger.error('deleteCouponsFromCart', error);
    });
};

export default deleteCouponsFromCart;
