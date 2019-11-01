import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { SORT_DATE_DESC } from '@shopgate/pwa-common/constants/DisplayOptions';
import { generateResultHash, mutable } from '@shopgate/pwa-common/helpers/redux';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import * as pipelines from '../constants/Pipelines';
import requestProductReviewsList from '../action-creators/requestReviews';
import receiveProductReviewsList from '../action-creators/receiveReviews';
import errorProductReviewsList from '../action-creators/errorReviews';

/**
 * Request product reviews for a product by the given id.
 * @param {string} productId The product ID.
 * @param {number} [limit=REVIEW_PREVIEW_COUNT] The maximum number of reviews to fetch.
 * @param {number} [offset=0] The list offset (defaults to 0).
 * @param {('relevance'|'dateDesc'|'dateAsc'|'rateDesc'|'rateAsc')} sort Sorting.
 * @returns {Function} The dispatched action.
 */
const fetchReviews = (
  productId,
  limit = REVIEW_PREVIEW_COUNT,
  offset = 0,
  sort = SORT_DATE_DESC
) => (dispatch) => {
  const hash = generateResultHash({
    pipeline: pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS,
    productId,
  }, false);
  dispatch(requestProductReviewsList(hash));

  /**
   * For testing purposes there's need to keep and return the promise reference, not a result of
   * chained functions.
   * Otherwise test case won't get the original resolver.
   * To get more insights, please take a look at ../spec.js.
   * @type {Promise}
   */
  const request = new PipelineRequest(pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS)
    .setInput({
      productId,
      limit,
      offset,
      sort,
    })
    .dispatch();

  request
    .then((result) => {
      dispatch(receiveProductReviewsList(hash, productId, result.reviews, result.totalReviewCount));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorProductReviewsList(hash));
    });

  return request;
};

/** @mixes {MutableFunction} */
export default mutable(fetchReviews);

