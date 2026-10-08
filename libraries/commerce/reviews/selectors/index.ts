import { createSelector } from 'reselect';
import { SORT_DATE_DESC } from '@shopgate/pwa-common/constants/DisplayOptions';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { getBaseProductId as getBaseProductIdSelector } from '@shopgate/engage/product/selectors/product';
import * as pipelines from '../constants/Pipelines';
import type {
  Review,
  ReviewId,
  ReviewListFilters,
  ReviewsProductProps,
  ReviewsProductState,
  ReviewsState,
} from '../types/reviews';

import { areReviewFiltersEqual } from '../helpers/filters';
import { isReviewCursorPagination } from './reviewSettings';

export * from './reviewSettings';
export * from './reviewSummary';
export * from './ownReviewVotes';

type AuthorState = {
  user: {
    login?: {
      isLoggedIn?: boolean;
    } | null;
    data?: {
      firstName?: string;
      lastName?: string;
    } | null;
  };
};

const NO_FILTERS: ReviewListFilters = {};

const getBaseProductId = getBaseProductIdSelector as (
  state: ReviewsProductState,
  props?: ReviewsProductProps
) => string | null;

/**
 * Selects the reviews slice.
 * @param state The global state.
 * @returns The reviews slice.
 */
const getReviewsState = (state: ReviewsState) => state.reviews;

/**
 * Selects the review previews stored by product id.
 * @param state The global state.
 * @returns The review previews stored by product id.
 */
const getProductReviewsExcerptState = (state: ReviewsState) => state.reviews.reviewsByProductId;

/**
 * Select the product reviews state.
 * @param state The current application state.
 * @returns The product reviews state.
 */
const getReviewsByHash = createSelector(
  getReviewsState,
  state => state.reviewsByHash
);

/**
 * Retrieves the fetching state for the current product's reviews.
 * @param state The current application state.
 * @returns The reviews for a product.
 */
const getCollectionForCurrentBaseProduct = createSelector(
  getBaseProductId,
  getReviewsByHash,
  (productId, reviews) => {
    const hash = generateResultHash({
      pipeline: pipelines.SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS,
      productId,
    }, false);

    if (reviews.hasOwnProperty(hash)) {
      return reviews[hash];
    }

    return null;
  }
);

/**
 * Select the product reviews state
 * @param state The current application state.
 * @returns The product reviews state.
 */
const getReviewsByProductId = createSelector(
  getReviewsState,
  state => state.reviewsByProductId
);

/**
 * Retrieves the reviews collection which contains all reviews data.
 * @param state The current application state.
 * @returns The reviews collection stored as reviewId => review pairs.
 */
export const getReviews = createSelector(
  getReviewsState,
  state => state.reviewsById || {}
);

/**
 * Retrieves the number of reviews for a product
 * @param state The current application state.
 * @returns The total review count for a product
 */
export const getProductReviewCount = createSelector(
  getBaseProductId,
  getReviewsByProductId,
  (productId, reviewsState) => {
    const collection = reviewsState[productId as string];

    if (!collection || typeof collection.totalReviewCount !== 'number') {
      return null;
    }

    return collection.totalReviewCount;
  }
);

/**
 * Retrieves the total number of reviews for a current product.
 * @param state The current application state.
 * @returns The total number of reviews.
 */
export const getReviewsTotalCount = createSelector(
  getCollectionForCurrentBaseProduct,
  (collection) => {
    if (!collection || typeof collection.totalReviewCount !== 'number') {
      return null;
    }

    return collection.totalReviewCount;
  }
);
/**
 * Retrieves the total number of currently fetched reviews for a current product.
 * @param state The current application state.
 * @returns The current number of fetched reviews.
 */
export const getCurrentReviewCount = createSelector(
  getCollectionForCurrentBaseProduct,
  (collection) => {
    if (!collection || !collection.reviews) {
      return null;
    }

    return collection.reviews.length;
  }
);

/**
 * Retrieves the sort of the last review list request of the current base product.
 * @param state The current application state.
 * @returns The sort, or the default sort when the list was not requested yet.
 */
export const getReviewListSort = createSelector(
  getCollectionForCurrentBaseProduct,
  collection => collection?.requestSort ?? SORT_DATE_DESC
);

/**
 * Retrieves the filters of the last review list request of the current base product.
 * @param state The current application state.
 * @returns The active filters; empty when the list is unfiltered or was not requested yet.
 */
export const getReviewListFilters = createSelector(
  getCollectionForCurrentBaseProduct,
  collection => collection?.requestFilters ?? NO_FILTERS
);

/**
 * Whether the last request asked for the first page of another sort or filter than the stored
 * reviews were loaded with. The stored reviews then do not belong to the requested list.
 * @param state The current application state.
 * @returns True from the request until its reviews were received, also after it failed.
 */
export const isReviewListQueryChanged = createSelector(
  getCollectionForCurrentBaseProduct,
  collection => !!collection
    && collection.requestOffset === 0
    && (
      collection.requestSort !== collection.sort
      || !areReviewFiltersEqual(collection.requestFilters, collection.filters)
    )
);

/**
 * Whether the review list of the current base product has a further page.
 * @param state The current application state.
 * @returns True when the provider returned a cursor for the next page or, with offset
 * pagination, fewer reviews are loaded than the list contains.
 */
export const hasMoreReviews = createSelector(
  getCollectionForCurrentBaseProduct,
  getCurrentReviewCount,
  getReviewsTotalCount,
  isReviewCursorPagination,
  (collection, count, totalCount, isCursor) => {
    if (!count) {
      return false;
    }

    if (isCursor) {
      return !!collection?.after;
    }

    return typeof totalCount === 'number' && count < totalCount;
  }
);

/**
 * Retrieves the information if reviews are currently fetched.
 * @param state The current application state.
 * @returns The boolean information if reviews are currently being fetched.
 */
export const getReviewsFetchingState = createSelector(
  getCollectionForCurrentBaseProduct,
  collection => collection && collection.isFetching
);

/**
 * Whether the review list of the current base product was not requested yet.
 * @param state The current application state.
 * @returns True when no list collection exists.
 */
export const isReviewListMissing = createSelector(
  getCollectionForCurrentBaseProduct,
  collection => collection === null
);

/**
 * Whether the last review list request of the current base product failed.
 * @param state The current application state.
 * @returns True when the last request failed, also when earlier pages are still stored.
 */
export const hasReviewListError = createSelector(
  getCollectionForCurrentBaseProduct,
  collection => !!collection && !collection.isFetching && collection.expires === 0
);

/**
 * Whether the review list of the current base product is still loading.
 * @param state The current application state.
 * @returns True while a request runs or before the first response, unless the last request failed.
 */
export const isReviewListLoading = createSelector(
  getCollectionForCurrentBaseProduct,
  hasReviewListError,
  (collection, hasError) => !!collection?.isFetching || (!collection?.reviews && !hasError)
);

/**
 * Retrieves the offset of the last review list request of the current base product.
 * @param state The current application state.
 * @returns The offset, or 0 when the list was not requested yet.
 */
export const getReviewListRequestOffset = createSelector(
  getCollectionForCurrentBaseProduct,
  collection => collection?.requestOffset ?? 0
);

/**
 * Select the user reviews state.
 * @param state The current application state.
 * @returns The user reviews collection stored as productId => review.
 */
const getUserReviewsByProductId = createSelector(
  getReviewsState,
  state => state.userReviewsByProductId
);

/**
 * Retrieves a user review for a product.
 */
export const getUserReviewForProduct = createSelector(
  getUserReviewsByProductId,
  getReviews,
  (state: ReviewsState, props: ReviewsProductProps = {}) => props.productId,
  (userReviews, allReviews, productId): Partial<Review> => {
    const userReview = userReviews && userReviews[productId as string];

    if (!userReview || !allReviews[userReview.review as ReviewId]) {
      return {};
    }

    return {
      ...allReviews[userReview.review as ReviewId],
    };
  }
);

/**
 * Gets user reviews fetching state. Only the first fetch is considered.
 * @returns True if user review for current product is being fetched.
 */
export const getUserReviewFirstFetchState = createSelector(
  getBaseProductId,
  getUserReviewsByProductId,
  (productId, userReviews) => !!(
    userReviews
      && productId
      && userReviews[productId]
      && !userReviews[productId].review
      && userReviews[productId].isFetching
  )

);

/**
 * Get a user name for the review form.
 * @param state The state.
 * @returns A user name.
 */
export const getDefaultAuthorName = (state: AuthorState) => (
  (isUserLoggedIn(state) && state.user.data && state.user.data.firstName)
    ? `${state.user.data.firstName} ${state.user.data.lastName}` : ''
);

/**
 * Retrieves the current product reviews in the order returned by the pipeline.
 * @param state The current application state.
 * @returns The reviews for a product.
 */
export const getProductReviews = createSelector(
  getCollectionForCurrentBaseProduct,
  getReviews,
  (collection, allReviews) => {
    if (!collection || !collection.reviews) {
      return [];
    }

    return collection.reviews.map(id => allReviews[id]);
  }
);

/**
 * Retrieves the current product reviews excerpt in the order returned by the pipeline.
 * @param state The current application state.
 * @returns The reviews for a product
 */
export const getProductReviewsExcerpt = createSelector(
  getBaseProductId,
  getProductReviewsExcerptState,
  getReviews,
  (productId, productReviewsState, reviewsState) => {
    const collection = productReviewsState[productId as string];

    if (!collection || !collection.reviews) {
      return null;
    }

    return collection.reviews.map(id => reviewsState[id]);
  }
);

/**
 * Retrieves the review preview collection of the current base product.
 * @param state The current application state.
 * @returns The collection, or null when the preview was not requested yet.
 */
const getProductReviewsExcerptCollection = createSelector(
  getBaseProductId,
  getProductReviewsExcerptState,
  (productId, productReviewsState) => productReviewsState[productId as string] || null
);

/**
 * Whether the review preview of the current base product was not requested yet.
 * @param state The current application state.
 * @returns True when no preview collection exists.
 */
export const isProductReviewsExcerptMissing = createSelector(
  getProductReviewsExcerptCollection,
  collection => collection === null
);

/**
 * Whether the last review preview request of the current base product failed before any
 * reviews were received.
 * @param state The current application state.
 * @returns True when the preview request failed.
 */
export const hasProductReviewsExcerptError = createSelector(
  getProductReviewsExcerptCollection,
  collection => !!collection
    && !collection.isFetching
    && !collection.reviews
    && collection.requestId !== undefined
);

/**
 * Whether the review preview of the current base product is still loading.
 * @param state The current application state.
 * @returns True while a request runs or before the first response, unless the last request failed.
 */
export const isProductReviewsExcerptLoading = createSelector(
  getProductReviewsExcerptCollection,
  hasProductReviewsExcerptError,
  (collection, hasError) => !!collection?.isFetching || (!collection?.reviews && !hasError)
);

/**
 * Whether the review preview of the current base product is requested without stored reviews.
 * @param state The current application state.
 * @returns True while a request runs and no response was stored yet; false for a refresh.
 */
export const isProductReviewsExcerptPending = createSelector(
  getProductReviewsExcerptCollection,
  collection => !!collection?.isFetching && !collection.reviews
);
