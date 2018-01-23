/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import requestProductVariants from '../action-creators/requestProductVariants';
import receiveProductVariants from '../action-creators/receiveProductVariants';
import errorProductVariants from '../action-creators/errorProductVariants';

/**
 * Retrieves product variants from store.
 * @param {string} productId The product ID for which the product variants are requested.
 * @return {Function} A Redux Thunk
 */
const getProductVariants = productId => (dispatch, getState) => {
  const state = getState();
  const cachedData = state.product.variantsByProductId[productId];

  if (!shouldFetchData(cachedData)) {
    return;
  }

  dispatch(requestProductVariants(productId));

  new PipelineRequest('getProductVariants')
    .setInput({ productId })
    .dispatch()
    .then(result => dispatch(receiveProductVariants(productId, result)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductVariants(productId));
    });
};

export default getProductVariants;
