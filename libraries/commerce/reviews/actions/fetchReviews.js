import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SORT_DATE_DESC } from '@shopgate/pwa-common/constants/DisplayOptions';
import { generateResultHash, mutable } from '@shopgate/pwa-common/helpers/redux';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS } from '../constants/Pipelines';
import requestProductReviewsList from '../action-creators/requestReviews';
import receiveProductReviewsList from '../action-creators/receiveReviews';
import errorProductReviewsList from '../action-creators/errorReviews';

let lastRequestId = 0;

/**
 * Request product reviews for a product by the given id.
 * @param {string} productId The product ID.
 * @param {number} [limit=REVIEW_PREVIEW_COUNT] The maximum number of reviews to fetch.
 * @param {number} [offset=0] The list offset (defaults to 0).
 * @param {string} [sort=SORT_DATE_DESC] Sorting, passed through to the pipeline unchanged.
 * @returns {Function} The dispatched action. It resolves with `null` when an identical request
 * is still in flight.
 */
function fetchReviews(productId, limit = REVIEW_PREVIEW_COUNT, offset = 0, sort = SORT_DATE_DESC) {
  return (dispatch, getState) => {
    const hash = generateResultHash({
      pipeline: SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS,
      productId,
    }, false);

    const collection = getState().reviews.reviewsByHash[hash];

    if (
      collection?.isFetching
      && collection.requestOffset === offset
      && collection.requestSort === sort
    ) {
      return Promise.resolve(null);
    }

    lastRequestId += 1;
    const meta = {
      requestId: lastRequestId,
      offset,
      sort,
    };

    dispatch(requestProductReviewsList(hash, meta));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS)
      .setInput({
        productId,
        limit,
        offset,
        sort,
      })
      .dispatch();

    request
      .then(({ reviews, totalReviewCount }) => {
        dispatch(receiveProductReviewsList(hash, productId, reviews, totalReviewCount, meta));
      })
      .catch(() => {
        dispatch(errorProductReviewsList(hash, meta));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchReviews);
