/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import {
  requestProduct,
  receiveProduct,
  errorProduct,
} from '../action-creators';
import processProductFlags from './processProductFlags';
import { getProductById } from '../selectors/product';

/**
 * Retrieves a product from the Redux store.
 * @param {string} productId The product ID.
 * @return {Function} A redux thunk.
 */
const getProduct = productId => (dispatch, getState) => {
  const state = getState();
  const product = getProductById(state, productId);

  if (!shouldFetchData(product)) {
    dispatch(processProductFlags(product.productData));

    return;
  }

  dispatch(requestProduct(productId));

  new PipelineRequest('getProduct')
    .setInput({ productId })
    .dispatch()
      .then((result) => {
        dispatch(processProductFlags(result));
        dispatch(receiveProduct(productId, result));
      })
      .catch((error) => {
        logger.error(error);
        dispatch(errorProduct(productId));
      });
};

export default getProduct;
