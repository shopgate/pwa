/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { EUNKNOWN, EACCESS } from '@shopgate/pwa-core/constants/Pipeline';
import requestUserReview from '../action-creators/requestUserReview';
import receiveUserReview from '../action-creators/receiveUserReview';
import errorUserReview from '../action-creators/errorUserReview';

/**
 * Request a user review for a product from server.
 * @param {string} productId The product ID.
 * @returns {Promise} The dispatched action.
 */
const getUserReview = productId => (dispatch, getState) => {
  const data = getState().reviews.userReviewsByProductId[productId];
  if (!shouldFetchData(data)) {
    return new Promise((resolve, reject) => reject());
  }
  dispatch(requestUserReview(productId));
  const request = new PipelineRequest('getUserReview')
    .setHandledErrors([EUNKNOWN, EACCESS])
    .setInput({
      productId,
    })
    .dispatch();

  request
    .then(result => dispatch(receiveUserReview(productId, result)))
    .catch(() => {
      dispatch(errorUserReview(productId));
    });

  return request;
};

export default getUserReview;
