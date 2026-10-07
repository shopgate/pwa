import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { SORT_DATE_DESC } from '@shopgate/pwa-common/constants/DisplayOptions';
import { generateResultHash, mutable } from '@shopgate/pwa-common/helpers/redux';
import type { Dispatch } from 'redux';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS } from '../constants/Pipelines';
import requestProductReviewsList from '../action-creators/requestReviews';
import receiveProductReviewsList from '../action-creators/receiveReviews';
import errorProductReviewsList from '../action-creators/errorReviews';
import { areReviewFiltersEqual, getActiveReviewFilters } from '../helpers/filters';
import { isReviewCursorPagination } from '../selectors/reviewSettings';
import type {
  ProductReviewsResponse,
  ReviewListFilters,
  ReviewsSliceState,
} from '../types/reviews';

type FetchReviewsState = {
  reviews: Pick<ReviewsSliceState, 'reviewsByHash' | 'reviewSettings'>;
};

let lastRequestId = 0;

/**
 * Request product reviews for a product by the given id.
 * @param productId The product ID.
 * @param limit The maximum number of reviews to fetch.
 * @param offset The list offset (defaults to 0). With cursor pagination any offset above 0 means
 * "next page": the stored cursor is sent instead. Without a stored cursor for the requested
 * sort and filter the first page is requested.
 * @param sort Sorting, passed through to the pipeline unchanged.
 * @param filters Filter flags by request parameter; only active filters are sent.
 * @returns The dispatched action. It resolves with `null` when an identical request
 * is still in flight.
 */
function fetchReviews(
  productId: string,
  limit: number = REVIEW_PREVIEW_COUNT,
  offset = 0,
  sort: string = SORT_DATE_DESC,
  filters: Partial<Record<keyof ReviewListFilters, boolean>> = {}
) {
  return (dispatch: Dispatch, getState: () => FetchReviewsState) => {
    const hash = generateResultHash({
      pipeline: SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS,
      productId,
    }, false);

    const activeFilters = getActiveReviewFilters(filters);
    const state = getState();
    const collection = state.reviews.reviewsByHash[hash];
    const isCursor = isReviewCursorPagination(state);
    const canContinue = isCursor
      && offset > 0
      && collection?.sort === sort
      && areReviewFiltersEqual(collection.filters, activeFilters);
    const after = (canContinue && collection.after) || null;
    const requestOffset = isCursor && !after ? 0 : offset;

    if (
      collection?.isFetching
      && collection.requestOffset === requestOffset
      && collection.requestSort === sort
      && areReviewFiltersEqual(collection.requestFilters, activeFilters)
    ) {
      return Promise.resolve(null);
    }

    lastRequestId += 1;
    const meta = {
      requestId: lastRequestId,
      offset: requestOffset,
      sort,
      ...(activeFilters && { filters: activeFilters }),
    };

    dispatch(requestProductReviewsList(hash, meta));

    const request = new PipelineRequest(SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS)
      .setInput({
        productId,
        limit,
        sort,
        ...(after ? { after } : requestOffset > 0 && { offset: requestOffset }),
        ...activeFilters,
      })
      .dispatch();

    request
      .then(({ reviews, totalReviewCount, cursors }: ProductReviewsResponse) => {
        dispatch(receiveProductReviewsList(
          hash,
          productId,
          reviews,
          totalReviewCount,
          meta,
          cursors?.after
        ));
      })
      .catch(() => {
        dispatch(errorProductReviewsList(hash, meta));
      });

    return request;
  };
}

/** @mixes {MutableFunction} */
export default mutable(fetchReviews);
