import { RECEIVE_CATEGORY } from '../constants';

/**
 * Dispatches the RECEIVE_CATEGORY action.
 * @param {string} categoryId The ID of the received category.
 * @param {Object} categoryData The data of the received category.
 * @param {Array} categoryChildren The children of received category.
 * @param {string} sort The sort order used for the request.
 * @return {Object} The RECEIVE_CATEGORY action.
 */
const receiveCategory = (categoryId, categoryData, categoryChildren, sort) => ({
  type: RECEIVE_CATEGORY,
  categoryId,
  categoryData,
  categoryChildren,
  sort,
  products: [],
});

export default receiveCategory;
