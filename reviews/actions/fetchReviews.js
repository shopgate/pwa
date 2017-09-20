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
import setProductId from '../../product/action-creators/setProductId';
import errorProductReviewsList from '../action-creators/errorReviews';

/**
 * Request product reviews for a product from a server.
 * @param {string} productId The product ID
 * @param {number} limit The maximum number of reviews to fetch
 * @param {number} offset The list offset (defaults to 0).
 * @param {string} sort Sorting: 'relevance', 'dateDesc', 'dateAsc', 'rateDesc', 'rateAsc'
 * @returns {Function} The dispatched action.
 */
const fetchReviews = (productId, limit = 2, offset = 0, sort = 'dateDesc') => (dispatch) => {
  const hash = generateResultHash({
    productId,
  });
  dispatch(setProductId(productId));
  dispatch(requestProductReviewsList(hash, productId, limit, offset));

  /**
   * For testing purposes there's need to keep and return the promise reference, not a result of
   * chained functions.
   * Otherwise test case won't get the original resolver.
   * To get more insights, please take a look at ../spec.js.
   * @type {Promise}
   */
  const promise = new PipelineRequest('getProductReviews')
    .setInput({
      productId,
      limit,
      offset,
      sort,
    })
    .dispatch();

  promise
    .then((result) => {
      dispatch(receiveProductReviewsList(hash, productId, result.reviews, result.totalReviewCount));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductReviewsList(hash, productId, limit, offset));
    });

  return promise;
};

export default fetchReviews;

