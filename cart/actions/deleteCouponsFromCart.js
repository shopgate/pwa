/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
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

  new PipelineRequest('deleteCouponsFromCart')
    .setInput({ couponCodes: couponIds })
    .dispatch()
    .then(({ messages }) => {
      dispatch(successDeleteCouponsFromCart());

      if (messages) {
        dispatch(errorDeleteCouponsFromCart(couponIds, messages));
      }
    })
    .catch((error) => {
      dispatch(errorDeleteCouponsFromCart(couponIds));
      logger.error('deleteCouponsFromCart', error);
    });
};

export default deleteCouponsFromCart;
