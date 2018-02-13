/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import updateProducts from '../action-creators/updateProductsInCart';
import successUpdateProductsInCart from '../action-creators/successUpdateProductsInCart';
import errorUpdateProductsInCart from '../action-creators/errorUpdateProductsInCart';

/**
 * Converts the update data into the format, which is currently expected by the pipeline.
 * @param {Array} updateData The original data.
 * @return {Array}
 */
const convertUpdateData = (updateData = []) => updateData.map(({ cartItemId, quantity }) => ({
  CartItemId: cartItemId,
  quantity,
}));

/**
 * Updates a product in the cart.
 * @param {Array} updateData The data for the updateProductsInCart request.
 * @return {Function} A redux thunk.
 */
const updateProductsInCart = updateData => (dispatch) => {
  // TODO: Remove, when pipeline accepts the correct format.
  const convertedData = convertUpdateData(updateData);

  dispatch(updateProducts(convertedData));

  const request = new PipelineRequest('updateProductsInCart');
  request.setInput({ CartItem: convertedData })
    .dispatch()
    .then(({ messages }) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(successUpdateProductsInCart(requestsPending));

      if (messages) {
        dispatch(errorUpdateProductsInCart(updateData, messages, requestsPending));
      }
    })
    .catch((error) => {
      const requestsPending = request.hasPendingRequests();
      dispatch(errorUpdateProductsInCart(updateData, undefined, requestsPending));
      logger.error('updateProductsInCart', error);
    });
};

export default updateProductsInCart;
