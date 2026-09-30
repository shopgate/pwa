import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SORT_DATE_DESC } from '@shopgate/pwa-common/constants/DisplayOptions';
import { generateResultHash, mutable } from '@shopgate/pwa-common/helpers/redux';
import type { Dispatch } from 'redux';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS } from '../constants/Pipelines';
import requestProductReviewsList from '../action-creators/requestReviews';
import receiveProductReviewsList from '../action-creators/receiveReviews';
import errorProductReviewsList from '../action-creators/errorReviews';
import type {
  ProductReviewsResponse,
  ReviewsSliceState,
} from '../types/reviews';

type FetchReviewsState = {
  reviews: Pick<ReviewsSliceState, 'reviewsByHash'>;
};

let lastRequestId = 0;

/**
 * Request product reviews for a product by the given id.
 * @param productId The product ID.
 * @param limit The maximum number of reviews to fetch.
 * @param offset The list offset (defaults to 0).
 * @param sort Sorting, passed through to the pipeline unchanged.
 * @returns The dispatched action. It resolves with `null` when an identical request
 * is still in flight.
 */
function fetchReviews(
  productId: string,
  limit: number = REVIEW_PREVIEW_COUNT,
  offset = 0,
  sort: string = SORT_DATE_DESC
) {
  return (dispatch: Dispatch, getState: () => FetchReviewsState) => {
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
      .then(({ reviews, totalReviewCount }: ProductReviewsResponse) => {
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
