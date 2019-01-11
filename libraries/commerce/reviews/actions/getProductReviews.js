import fetchProductReviews from './fetchProductReviews';

/**
 * Request product reviews for a product from server.
 * @param {string} productId The product ID
 * @param {number} [limit=REVIEW_PREVIEW_COUNT] The maximum number of reviews to fetch
 * @param {('relevance'|'dateDesc'|'dateAsc'|'rateDesc'|'rateAsc')} [sort=SORT_RELEVANCE] Sorting.
 * @returns {Promise} The dispatched action.
 * @deprecated
 */
const getProductReviews = fetchProductReviews;

export default getProductReviews;
