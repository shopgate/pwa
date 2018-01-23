/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import deleteProducts from '../action-creators/deleteProductsFromCart';
import successDeleteProductsFromCart from '../action-creators/successDeleteProductsFromCart';
import errorDeleteProductsFromCart from '../action-creators/errorDeleteProductsFromCart';

/**
 * Deletes products from the cart.
 * @param {Array} cartItemIds The IDs of the items to remove from the cart.
 * @return {Function} A redux thunk.
 */
const deleteProductsFromCart = cartItemIds => (dispatch) => {
  dispatch(deleteProducts(cartItemIds));

  new PipelineRequest('deleteProductsFromCart')
    .setInput({ CartItemIds: cartItemIds })
    .dispatch()
    .then(({ messages }) => {
      dispatch(successDeleteProductsFromCart());

      if (messages) {
        dispatch(errorDeleteProductsFromCart(cartItemIds, messages));
      }
    })
    .catch((error) => {
      dispatch(errorDeleteProductsFromCart(cartItemIds));
      logger.error('deleteProductsFromCart', error);
    });
};

export default deleteProductsFromCart;
