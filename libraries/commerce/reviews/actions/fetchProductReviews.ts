import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData, mutable } from '@shopgate/pwa-common/helpers/redux';
import { SORT_RELEVANCE } from '@shopgate/pwa-common/constants/DisplayOptions';
import type { Dispatch } from 'redux';
import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS } from '../constants/Pipelines';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import requestProductReviews from '../action-creators/requestProductReviews';
import receiveProductReviews from '../action-creators/receiveProductReviews';
import errorProductReviews from '../action-creators/errorProductReviews';
import type {
  ProductReviewsResponse,
  ReviewsSliceState,
} from '../types/reviews';

type FetchProductReviewsState = {
  reviews: Pick<ReviewsSliceState, 'reviewsByProductId'>;
};

let lastRequestId = 0;

/**
 * Request product reviews for a product from server.
 * @param productId The product ID
 * @param limit The maximum number of reviews to fetch
 * @param sort Sorting, passed through to the pipeline unchanged.
 * @returns The dispatched action.
 */
function fetchProductReviews(
  productId: string,
  limit: number = REVIEW_PREVIEW_COUNT,
  sort: string = SORT_RELEVANCE
) {
  return (dispatch: Dispatch, getState: () => FetchProductReviewsState) => {
    const data = getState().reviews.reviewsByProductId[productId];

    if (!shouldFetchData(data)) {
      return Promise.resolve(null);
    }

    lastRequestId += 1;
    const meta = {
      requestId: lastRequestId,
      sort,
    };

    dispatch(requestProductReviews(productId, limit, meta));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS)
      .setInput({
        productId,
        limit,
        sort,
      })
      .dispatch();

    request
      .then(({ reviews, totalReviewCount, ratingSummary }: ProductReviewsResponse) => {
        dispatch(receiveProductReviews(productId, reviews, totalReviewCount, meta, ratingSummary));
      })
      .catch(() => {
        dispatch(errorProductReviews(productId, meta));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchProductReviews);
