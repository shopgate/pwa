import fetchUserReview from './fetchUserReview';

/**
 * Request a user review for a product from server.
 * @param {string} productId The product ID.
 * @returns {Promise} The dispatched action.
 * @deprecated
 */
const getUserReview = fetchUserReview;

export default getUserReview;
