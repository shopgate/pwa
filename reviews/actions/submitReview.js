/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import requestSubmitReview from '../action-creators/requestSubmitReview';
import receiveSubmitReview from '../action-creators/receiveSubmitReview';
import errorSubmitReview from '../action-creators/errorSubmitReview';
import resetSubmittedReview from '../action-creators/resetSubmittedReview';
import { getUserReviewForProduct } from '../selectors/index';
import getProduct from '../../product/actions/getProduct';

/**
 * Request a user review for a product from server.
 * @param {string} review The review data
 * @param {boolean} update Indicate whether the update pipeline be called or not.
 * @returns {Function} The dispatched action.
 */
const submitReview = (review, update = false) => (dispatch, getState) => {
  const originalReview = getUserReviewForProduct(getState());
  dispatch(requestSubmitReview(review));

  let Pipeline;
  if (update) {
    Pipeline = new PipelineRequest('updateProductReview');
  } else {
    Pipeline = new PipelineRequest('addProductReview');
  }

  const fields = ['rate', 'title', 'review', 'author', 'productId'];
  const pipelineData = {};
  fields.forEach((field) => {
    pipelineData[field] = review[field] || null;
  });

  const request = Pipeline
    .setInput(pipelineData)
    .dispatch();

  request
    .then((result) => {
      let newReview = result;
      if (update) {
        newReview = review;
      }
      dispatch(receiveSubmitReview(newReview));
      dispatch(getProduct(review.productId, true));
    })
    .catch((error) => {
      logger.error(error);
      if (update) {
        dispatch(resetSubmittedReview(originalReview));
      } else {
        dispatch(errorSubmitReview(review.productId));
      }
    });

  return request;
};

export default submitReview;
