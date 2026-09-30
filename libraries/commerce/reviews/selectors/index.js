import { createSelector } from 'reselect';
import { generateResultHash } from '@shopgate/pwa-common/helpers/redux';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import * as pipelines from '../constants/Pipelines';
import { getBaseProductId } from '../../product/selectors/product';

export * from './reviewSettings';

/**
 * @param {Object} state The global state.
 * @return {Object}
 */
const getReviewsState = state => state.reviews;

/**
 * @param {Object} state The global state.
 * @return {Object}
 */
const getProductReviewsExcerptState = state => state.reviews.reviewsByProductId;

/**
 * Select the product reviews state.
 * @param {Object} state The current application state.
 * @return {Object} The product reviews state.
 */
const getReviewsByHash = createSelector(
  getReviewsState,
  state => state.reviewsByHash
);

/**
 * Retrieves the fetching state for the current product's reviews.
 * @param {Object} state The current application state.
 * @return {Object|null} The reviews for a product.
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
 * @param {Object} state The current application state.
 * @return {Object} The product reviews state.
 */
const getReviewsByProductId = createSelector(
  getReviewsState,
  state => state.reviewsByProductId
);

/**
 * Retrieves the reviews collection which contains all reviews data.
 * @param {Object} state The current application state.
 * @return {Object} The reviews collection stored as reviewId => review pairs.
 */
export const getReviews = createSelector(
  getReviewsState,
  state => state.reviewsById || {}
);

/**
 * Retrieves the number of reviews for a product
 * @param {Object} state The current application state.
 * @return {number} The total review count for a product
 */
export const getProductReviewCount = createSelector(
  getBaseProductId,
  getReviewsByProductId,
  (productId, reviewsState) => {
    const collection = reviewsState[productId];

    if (!collection || typeof collection.totalReviewCount !== 'number') {
      return null;
    }

    return collection.totalReviewCount;
  }
);

/**
 * Retrieves the total number of reviews for a current product.
 * @param {Object} state The current application state.
 * @return {number|null} The total number of reviews.
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
 * @param {Object} state The current application state.
 * @return {number|null} The current number of fetched reviews.
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
 * Retrieves the information if reviews are currently fetched.
 * @param {Object} state The current application state.
 * @return {bool} The boolean information if reviews are currently being fetched.
 */
export const getReviewsFetchingState = createSelector(
  getCollectionForCurrentBaseProduct,
  collection => collection && collection.isFetching
);

/**
 * Select the user reviews state.
 * @param {Object} state The current application state.
 * @return {Object} The user reviews collection stored as productId => review.
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
  (state, props = {}) => props.productId,
  (userReviews, allReviews, productId) => {
    if (!userReviews || !userReviews[productId] || !allReviews[userReviews[productId].review]) {
      return {};
    }

    return {
      ...allReviews[userReviews[productId].review],
    };
  }
);

/**
 * Gets user reviews fetching state. Only the first fetch is considered.
 * @return {bool} True if user review for current product is being fetched.
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
 * @param {Object} state The state.
 * @returns {string} A user name.
 */
export const getDefaultAuthorName = state => (
  (isUserLoggedIn && state.user.data && state.user.data.firstName)
    ? `${state.user.data.firstName} ${state.user.data.lastName}` : ''
);

/**
 * Retrieves the current product reviews in the order returned by the pipeline.
 * @param {Object} state The current application state.
 * @return {Array} The reviews for a product.
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
 * @param {Object} state The current application state.
 * @return {Array|null} The reviews for a product
 */
export const getProductReviewsExcerpt = createSelector(
  getBaseProductId,
  getProductReviewsExcerptState,
  getReviews,
  (productId, productReviewsState, reviewsState) => {
    const collection = productReviewsState[productId];

    if (!collection || !collection.reviews) {
      return null;
    }

    return collection.reviews.map(id => reviewsState[id]);
  }
);
