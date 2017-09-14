/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import requestProductReviewsList from '../action-creators/requestReviews';
import receiveProductReviewsList from '../action-creators/receiveReviews';
import errorProductReviewsList from '../action-creators/errorReviews';

/**
 * Request product reviews for a product from server.
 * @param {string} productId The product ID
 * @param {number} limit The maximum number of reviews to fetch
 * @param {number} offset The list offset (defaults to 0).
 * @returns {Function} The dispatched action.
 */
const fetchReviews = (productId, limit = 2, offset = 0) => (dispatch) => {
  const hash = generateResultHash({
    productId,
  });
  dispatch(requestProductReviewsList(hash, productId, limit, offset));
  new PipelineRequest('getProductReviews')
    .setInput({
      productId,
      limit,
      offset,
    })
    .dispatch()
    .then((result) => {
      dispatch(receiveProductReviewsList(hash, productId, result.reviews, result.totalReviewCount));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductReviewsList(hash, productId, limit, offset));
    });
};

export default fetchReviews;

