/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import {
  addProductsToCart,
  successAddProductsToCart,
  errorAddProductsToCart,
  setCartProductPendingCount,
} from '../action-creators';
import { getProductPendingCount } from '../selectors';

/**
 * Adds a product to the cart.
 * @param {Array} productData The options for the products to be added.
 * @return {Function} A redux thunk.
 */
const addToCart = productData => (dispatch, getState) => {
  const pendingProductCount = getProductPendingCount(getState());

  dispatch(addProductsToCart(productData));
  dispatch(setCartProductPendingCount(pendingProductCount + 1));

  new PipelineRequest('addProductsToCart')
    .setInput({ products: productData })
    .dispatch()
    .then(({ messages }) => {
      dispatch(successAddProductsToCart());

      if (messages) {
        /**
         * If the addProductsToCart request fails, the pipeline doesn't respond with an error,
         * but a messages array within the response payload. So by now we also have to dispatch
         * the error action here.
         */
        dispatch(errorAddProductsToCart(productData, messages));
      }
    })
    .catch((error) => {
      dispatch(errorAddProductsToCart(productData));
      logger.error('addProductsToCart', error);
    });
};

export default addToCart;
