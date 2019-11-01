import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SORT_RELEVANCE } from '@shopgate/pwa-common/constants/DisplayOptions';
import * as pipelines from '../constants/Pipelines';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import requestProductReviews from '../action-creators/requestProductReviews';
import receiveProductReviews from '../action-creators/receiveProductReviews';
import errorProductReviews from '../action-creators/errorProductReviews';

/**
 * Request product reviews for a product from server.
 * @param {string} productId The product ID
 * @param {number} [limit=REVIEW_PREVIEW_COUNT] The maximum number of reviews to fetch
 * @param {('relevance'|'dateDesc'|'dateAsc'|'rateDesc'|'rateAsc')} [sort=SORT_RELEVANCE] Sorting.
 * @returns {Promise} The dispatched action.
 */
const fetchProductReviews = (
  productId,
  limit = REVIEW_PREVIEW_COUNT,
  sort = SORT_RELEVANCE
) => (dispatch, getState) => {
  const data = getState().reviews.reviewsByProductId[productId];
  if (!shouldFetchData(data)) {
    return new Promise(resolve => resolve());
  }
  dispatch(requestProductReviews(productId, limit));

  const request = new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS)
    .setInput({
      productId,
      limit,
      sort,
    })
    .dispatch();

  request
    .then((result) => {
      dispatch(receiveProductReviews(productId, result.reviews, result.totalReviewCount));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductReviews(productId));
    });

  return request;
};

/** @mixes {MutableFunction} */
export default mutable(fetchProductReviews);

