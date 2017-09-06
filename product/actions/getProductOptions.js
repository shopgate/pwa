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
  requestProductOptions,
  receiveProductOptions,
  errorProductOptions,
} from '../action-creators';

/**
 * Retrieves product options from store.
 * @param {string} productId The product ID for which the product options are requested.
 * @return {Function} A Redux Thunk
 */
const getProductOptions = productId => (dispatch, getState) => {
  const state = getState();
  const cachedData = state.product.optionsByProductId[productId];

  if (!shouldFetchData(cachedData)) {
    return;
  }

  dispatch(requestProductOptions(productId));

  new PipelineRequest('getProductOptions')
    .setInput({ productId })
    .dispatch()
    .then(result => dispatch(receiveProductOptions(productId, result.options)))
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductOptions(productId));
    });
};

export default getProductOptions;
