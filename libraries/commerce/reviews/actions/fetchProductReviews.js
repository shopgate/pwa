import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SORT_RELEVANCE } from '@shopgate/pwa-common/constants/DisplayOptions';
import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS } from '../constants/Pipelines';
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
function fetchProductReviews(productId, limit = REVIEW_PREVIEW_COUNT, sort = SORT_RELEVANCE) {
  return (dispatch, getState) => {
    const data = getState().reviews.reviewsByProductId[productId];

    if (!shouldFetchData(data)) {
      return Promise.resolve(null);
    }

    dispatch(requestProductReviews(productId, limit));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS)
      .setInput({
        productId,
        limit,
        sort,
      })
      .dispatch();

    request
      .then(({ reviews, totalReviewCount }) => {
        dispatch(receiveProductReviews(productId, reviews, totalReviewCount));
      })
      .catch(() => {
        dispatch(errorProductReviews(productId));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductReviews);
