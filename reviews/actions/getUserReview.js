/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { EUNKNOWN, EACCESS } from '@shopgate/pwa-core/constants/Pipeline';
import requestUserReview from '../action-creators/requestUserReview';
import receiveUserReview from '../action-creators/receiveUserReview';
import errorUserReview from '../action-creators/errorUserReview';

/**
 * Request a user review for a product from server.
 * @param {string} productId The product ID
 * @returns {Function} The dispatched action.
 */
const getUserReview = productId => (dispatch) => {
  dispatch(requestUserReview(productId));
  const request = new PipelineRequest('getUserReview')
    .setHandledErrors([EUNKNOWN, EACCESS])
    .setInput({
      productId,
    })
    .dispatch();

  request
    .then(result => dispatch(receiveUserReview(productId, result)))
    .catch((message) => {
      logger.error(message);
      dispatch(errorUserReview(productId));
    });

  return request;
};

export default getUserReview;
