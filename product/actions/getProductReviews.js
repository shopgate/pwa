import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';

import {
  requestProductReviews,
  receiveProductReviews,
  errorProductReviews,
} from '../action-creators';

/**
 * Request product reviews for a product from server.
 * @param {string} productId The product ID
 * @param {number} limit The max number of reviews to fetch
 * @returns {Function} The dispatched action.
 */
const getProductReviews = (productId, limit = 2) => (dispatch) => {
  dispatch(requestProductReviews(productId, limit));

  new PipelineRequest('getProductReviews')
    .setInput({
      productId,
      limit,
    })
    .dispatch()
    .then((result) => {
      logger.log('reviews result', result);
      dispatch(receiveProductReviews(productId, result.reviews));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductReviews(productId));
    });
};

export default getProductReviews;

